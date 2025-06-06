<template>
  <div
    v-if="loading"
    class="flex justify-content-center p-4"
  >
    <i class="pi pi-spin pi-spinner text-2xl"></i>
  </div>

  <div
    v-else-if="error"
    class="flex justify-content-center p-4 text-red-500"
  >
    {{ error }}
  </div>

  <div v-else-if="applications.length > 0">
    <div class="hidden lg:flex w-full">
      <DataTable
        :value="applications"
        table-style="min-width: 50rem"
        striped-rows
        paginator
        :rows="5"
        class="p-datatable-sm custom-table w-full"
      >
        <Column
          field="type"
          header="Тип заявления"
        >
          <template #body="slotProps">
            {{ getTypeTranslation(slotProps.data.type) }}
          </template>
        </Column>
        <Column
          field="date"
          class="w-2"
          header-class="text-center"
          body-class="text-center"
        >
          <template #header>
            <span class="m-auto font-bold">Дата подачи</span>
          </template>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date) }}
          </template>
        </Column>

        <Column
          field="status"
          class="w-2"
          header-class="text-center"
          body-class="text-center"
        >
          <template #header>
            <span class="m-auto font-bold">Статус</span>
          </template>
          <template #body="slotProps">
            <Tag
              :value="statusVerboseName(slotProps.data.status)"
              :class="['status-label', AppService.getStatusClass(slotProps.data.status)]"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
              type="button"
              rounded
              size="small"
              icon="pi pi-ellipsis-v"
              severity="secondary"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              :loading="applicationLoadingState[slotProps.data.id]"
              @click="(event) => application_menus[slotProps.data.id].toggle(event)"
            />
            <Menu
              id="overlay_menu"
              :ref="(el) => initMenuRef(slotProps.data.id, el)"
              :model="getMenuItems(slotProps.data)"
              :popup="true"
            />
            <CommentDialog
              v-model:visible="comment_dialog_visibile[slotProps.data.id]"
              :application-id="slotProps.data.id"
              :comments="commentsByApplicationId(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="flex flex-column lg:hidden">
      <ApplicationCard
        v-for="application in applications"
        :key="application.id"
        :type="getTypeTranslation(application.type)"
        :date="formatDate(application.date)"
        :status="statusVerboseName(application.status)"
        :status-class="['status-label', AppService.getStatusClass(application.status)]"
      >
        <template #actions>
          <Button
            type="button"
            rounded
            size="small"
            icon="pi pi-ellipsis-v"
            severity="secondary"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            :loading="applicationLoadingState[application.id]"
            @click="(event) => application_menus[application.id].toggle(event)"
          />
          <Menu
            id="overlay_menu"
            :ref="(el) => initMenuRef(application.id, el)"
            :model="getMenuItems(application)"
            :popup="true"
          />
          <CommentDialog
            v-model:visible="comment_dialog_visibile[application.id]"
            :application-id="application.id"
            :comments="commentsByApplicationId(application.id)"
          />
        </template>
      </ApplicationCard>
    </div>
  </div>

  <!-- Empty state -->
  <div
    v-else
    class="flex justify-content-center p-4"
  >
    <p>У вас пока нет поданных заявлений</p>
  </div>

  <div
    v-if="isCreateButtonShown()"
    class="flex flex-column align-items-center mt-4 mb-4"
    @click="router.push({ name: 'Create Application' })"
  >
    <Button
      v-if="isCreateButtonShown"
      label="Подать заявление"
      icon="pi pi-plus"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Column, DataTable, Button, Tag, Menu, useConfirm } from 'primevue';
import { useAuthStore } from '../../store/authStore.js';
import ApplicationService from '../../services/applicationService.js';
import { useApplicationsStore } from '../../store/applicationsStore.js';
import StatusService from '../../services/statusService.js';
import AppService from '../../services/appService.js';
import Toast from '../../tools/toast.js';
import CommentDialog from './CommentDialog.vue';
import CommentService from '../../services/commentService.js';
import { useDownloadPDF } from '../../composables/downloadPDF.js';
import ApplicationCard from './ApplicationCard.vue';

const applications = ref([]);
const loading = ref(true);
const error = ref(null);
const statuses = ref({});
const applicationsComments = ref({});

const authStore = useAuthStore();
const router = useRouter();
const applicationStore = useApplicationsStore();
const toast = new Toast();
const confirm = useConfirm();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const comment_dialog_visibile = ref({});
const application_menus = ref({});
const applicationLoadingState = ref({});

const getTypeTranslation = (type) => {
  switch (type) {
    case 'reinstatement':
      return 'Заявление на восстановление';
    case 'change':
      return 'Заявление на изменение условий обучния';
    case 'transfer':
      return 'Заявление на перевод из другого ВУЗа';
    default:
      return type;
  }
};

const getMenuItems = (data) => {
  let items = [];
  const { isLoading, downloadPdf } = useDownloadPDF();

  watch(isLoading, (value) => (applicationLoadingState.value[data.id] = value));

  if (data.id > 0)
    items.push({
      label: 'Сохранить в PDF',
      icon: 'pi pi-file-pdf',
      command: async () => await downloadPdf(data.id, data.type),
    });

  if (commentsByApplicationId(data.id).length > 0)
    items.push({
      label: 'Комментарии',
      icon: 'pi pi-comment',
      disabled: false,
      command: () => {
        comment_dialog_visibile.value[data.id] = !comment_dialog_visibile.value[data.id];
      },
    });
  if (isEditShown(data))
    items.push({
      label: 'Изменить',
      icon: 'pi pi-pencil',
      command: () => {
        editApplication(data);
      },
    });
  if (isDeleteShown(data))
    items.push({
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: (event) => {
        confirmedDeleteApplication(data, event);
      },
    });
  return items;
};

const initMenuRef = (id, el) => {
  if (el) {
    application_menus.value[id] = el;
  }
};

const confirmedDeleteApplication = (data, event) => {
  let require_config = {
    message: 'Вы уверены, что хотите удалить заявление?',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      label: 'Нет',
      severity: 'secondary',
    },
    acceptProps: {
      label: 'Да',
      severity: 'danger',
    },
    accept: async () => {
      await deleteApplication(data);
    },
    reject: () => {},
  };

  if (event) require_config = { ...require_config, target: event.currentTarget };
  confirm.require(require_config);
};

const deleteApplication = async (data) => {
  applications.value = applications.value.filter((item) => item.id != data.id);
  if (data.status === 'draft') applicationStore.setDraftApplication(null);
  else
    try {
      await ApplicationService.delete(data.id);
    } catch (error) {
      toast.error('При удалении заявления произошла ошибка');
      throw error;
    }
  toast.success('Заявление удалено');
};

const isEditShown = (data) => {
  const statuses = ['draft'];
  return statuses.some((el) => el == data.status);
};

const isDeleteShown = (data) => {
  const statuses = ['draft', 'new'];
  return statuses.some((el) => el == data.status);
};

const editApplication = (data) => {
  router.push({
    name: 'Edit application',
    params: { id: data.id },
    query: { type: data.type },
  });
};

const fetchApplications = async () => {
  loading.value = true;
  error.value = null;
  let res;
  try {
    res = await ApplicationService.fetchUserApplications();
  } catch (err) {
    console.error('Error fetching applications:', err);
    error.value = 'Не удалось загрузить заявления. Пожалуйста, попробуйте позже.';
  } finally {
    loading.value = false;
  }

  let draft = applicationStore.draftApplication;
  if (draft) {
    draft = {
      id: 0,
      date: draft.date,
      type: draft.type,
      status: 'draft',
    };
  }

  applications.value = draft ? [draft, ...res] : [...res];

  for (const application of applications.value)
    comment_dialog_visibile.value[application.id] = false;
};

const fetchStatuses = async () => {
  const res = await StatusService.fetchAll();
  const mapper = res.reduce((acc, obj) => {
    acc[obj.title] = obj;
    return acc;
  }, {});
  mapper.draft = { title: 'draft', verbose_name: 'Черновик' };
  statuses.value = mapper;
};

const fetchUserComments = async () => {
  const comments = await CommentService.getUserComments();
  Object.assign(applicationsComments.value, comments);
};

const commentsByApplicationId = (application_id) => {
  return applicationsComments.value[application_id] || [];
};

onMounted(async () => {
  await fetchApplications();
  await fetchStatuses();
  await fetchUserComments();
});

const statusVerboseName = (title) => {
  if (!statuses.value[title]) return title;
  return String(statuses.value[title].verbose_name);
};

const isCreateButtonShown = () => {
  const inProgressStatuses = ['draft', 'new', 'needs correction', 'in progress'];
  if (!authStore.checkPermissions(['canCreateSelfApplication'])) {
    return false;
  }
  if (
    applications.value.length > 0 &&
    applications.value.some((el) => inProgressStatuses.includes(el.status))
  ) {
    return false;
  }
  return true;
};
</script>

<style scoped>
.content {
  max-width: 1100px;
  min-width: 840px;
}

.status-badge {
  display: inline-block;
  font-weight: 500;
}

/* Add these styles to increase row height */
.custom-table :deep(tr) {
  height: 5.5rem;
}

.new-status-color {
  background-color: rgba(from var(--p-blue-500) r g b / 0.2);
}

.approved-status-color {
  background-color: rgba(from var(--p-green-500) r g b / 0.2);
}

.rejected-status-color {
  background-color: rgba(from var(--p-red-500) r g b / 0.2);
}

.draft-status-color {
  background-color: rgba(from var(--p-gray-500) r g b / 0.2);
}
</style>
