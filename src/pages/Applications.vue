<template>
  <div class="content w-10 surface-0 m-auto p-3 flex flex-column border-round">
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
      data-key="id"
      :loading="loading"
      table-style="min-width: 60rem"
      striped-rows
      paginator
      :rows="10"
      class="p-datatable-sm custom-table"
    >
      <Column
        field="fio"
        header="ФИО"
      >
        <template #body="slotProps">
          {{ getShortFullName(slotProps.data.fio) }}
        </template>
      </Column>
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
              rounded
              severity="secondary"
              icon="pi pi-eye m-auto"
              size="small"
              @click="editApplication(slotProps.data)"
            />
            <Button
              v-if="authStore.checkPermissions(['canDeleteApplications'])"
              rounded
              size="small"
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              @click="deleteApplication(slotProps.data.id)"
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
      <p>Пока нет поданных заявлений</p>
    </div>

    <div
      v-if="isCreateButtonShown()"
      class="flex flex-column align-items-center mt-4 mb-4"
      @click="router.push({ name: 'Create Application' })"
    >
      <Button
        v-if="!applicationStore.draftApplication"
        label="Подать заявление"
        icon="pi pi-plus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Column, DataTable, Button, Tag } from 'primevue';
import { useAuthStore } from '../store/authStore.js';
import ApplicationService from '../services/applicationService.js';
import { useApplicationsStore } from '../store/applicationsStore.js';
import AppService from '../services/appService.js';
import StatusService from '../services/statusService.js';

const applications = ref([]);
const loading = ref(true);
const error = ref(null);
const statuses = ref({});

const authStore = useAuthStore();
const router = useRouter();
const applicationStore = useApplicationsStore();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const getShortFullName = (fullname) => {
  const [surname, name, patronimyc] = fullname.split(' ');
  return `${surname} ${name[0]}.${patronimyc[0]}.`;
};

const editApplication = (data) => {
  router.push({
    name: 'Process application',
    params: { id: data.id },
    query: { type: data.type },
  });
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

const fetchApplications = async () => {
  loading.value = true;
  error.value = null;
  let res;
  try {
    res = await ApplicationService.fetchApplications();
  } catch {
    error.value = 'Не удалось загрузить заявления. Пожалуйста, попробуйте позже.';
  } finally {
    loading.value = false;
  }

  applications.value = [...applications.value, ...res];
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

const deleteApplication = async (application_id) => {
  await ApplicationService.delete(application_id);
  applications.value = applications.value.filter((el) => el.id != application_id);
};

onMounted(async () => {
  await fetchApplications();
  await fetchStatuses();
});

const statusVerboseName = (title) => {
  if (!statuses.value[title]) return title;
  return String(statuses.value[title].verbose_name);
};

const isCreateButtonShown = () => {
  if (authStore.checkPermissions(['canCreateManySelfApplications'])) {
    return true;
  }
  if (
    authStore.checkPermissions(['canCreateSelfApplication']) &&
    (applications.value.length === 0 || !applications.value.some((app) => app.status === 'new'))
  ) {
    return true;
  }
  return false;
};
</script>

<style scoped>
.content {
  max-width: 1200px;
  min-width: 840px;
}

.status-badge {
  display: inline-block;
  font-weight: 500;
}

/* Add these styles to increase row height */
.custom-table :deep(tr) {
  height: 2rem;
}
</style>
