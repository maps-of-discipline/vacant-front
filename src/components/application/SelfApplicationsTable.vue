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

  <DataTable
    v-else-if="applications.length > 0"
    :value="applications"
    table-style="min-width: 50rem"
    striped-rows
    paginator
    :rows="5"
    class="p-datatable-sm custom-table"
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
        <div class="w-full flex justify-content-end gap-2">
          <Button
            v-if="isEditShown(slotProps.data)"
            rounded
            severity="secondary"
            icon="pi pi-pencil m-auto"
            size="small"
            @click="editApplication(slotProps.data)"
          />
          <Button
            v-if="isDeleteShown(slotProps.data)"
            rounded
            severity="danger"
            icon="pi pi-trash m-auto"
            size="small"
            @click="deleteApplication(slotProps.data)"
          />
          <CommentDialog
            :application-id="slotProps.data.id"
            :comments="commentsByApplicationId(slotProps.data.id)"
          />
          <DownloadPDFApplication
            :id="slotProps.data.id"
            :type="slotProps.data.type"
          />
        </div>
      </template>
    </Column>
  </DataTable>

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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Column, DataTable, Button, Tag } from 'primevue';
import { useAuthStore } from '../../store/authStore.js';
import ApplicationService from '../../services/applicationService.js';
import { useApplicationsStore } from '../../store/applicationsStore.js';
import StatusService from '../../services/statusService.js';
import AppService from '../../services/appService.js';
import Toast from '../../tools/toast.js';
import CommentDialog from './CommentDialog.vue';
import CommentService from '../../services/commentService.js';
import config from '../../config.js';
import DocumentService from '../../services/documnet.js';
import DownloadPDFApplication from '../UI/DownloadPDFApplication.vue';

const applications = ref([]);
const loading = ref(true);
const error = ref(null);
const statuses = ref({});
const applicationsComments = ref({});

const authStore = useAuthStore();
const router = useRouter();
const applicationStore = useApplicationsStore();
const toast = new Toast();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};


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
