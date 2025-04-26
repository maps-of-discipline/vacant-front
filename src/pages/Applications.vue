<template>
  <div class="content w-10 surface-0 m-auto p-3 flex flex-column border-round">
    <div class="flex justify-content-center p-4" v-if="loading">
      <i class="pi pi-spin pi-spinner text-2xl"></i>
    </div>

    <div class="flex justify-content-center p-4 text-red-500" v-else-if="error">
      {{ error }}
    </div>

    <DataTable
      :value="applications"
      dataKey="id"
      :loading="loading"
      tableStyle="min-width: 60rem"
      v-else-if="applications.length > 0"
      stripedRows
      paginator
      :rows="10"
      class="p-datatable-sm custom-table"
    >
      <Column field='fio' header="ФИО">
        <template #body="slotProps">
          {{ getShortFullName(slotProps.data.fio) }}
        </template>
      </Column>
      <Column field="type" header="Тип заявления">
        <template #body="slotProps">
          {{ getTypeTranslation(slotProps.data.type) }}
        </template>
      </Column>
      <Column
        field="date"
        class="w-2"
        headerClass="text-center"
        bodyClass="text-center"
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
        headerClass="text-center"
        bodyClass="text-center"
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
        <template #body="slotProps" class="">
          <div class="w-full flex justify-content-end gap-2">
            <Button
              rounded
              severity="secondary"
              icon="pi pi-eye m-auto"
              @click="editApplication(slotProps.data)"
              size="small"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Empty state -->
    <div class="flex justify-content-center p-4" v-else>
      <p>У вас пока нет поданных заявлений</p>
    </div>

    <div
      class="flex flex-column align-items-center mt-4 mb-4"
      v-if="isCreateButtonShown()"
      @click="router.push({ name: 'Create Application' })"
    >
      <Button
        label="Подать заявление"
        icon="pi pi-plus"
        v-if="!applicationStore.draftApplication"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Column, DataTable, Button, Tag, useToast } from "primevue";
import { useAuthStore } from "../store/authStore.js";
import { useAppStore } from "../store/appStore.js";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";
import AppService from "../services/appService.js";
import StatusService from "../services/statusService.js";

const applications = ref([]);
const loading = ref(true);
const error = ref(null);
const statuses = ref({});


const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();
const applicationStore = useApplicationsStore();
const toast = useToast();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
};


const getShortFullName = (fullname) => {
  const [surname, name, patronimyc] = fullname.split(' ')
  return `${surname} ${name[0]}.${patronimyc[0]}.`
}

const editApplication = (data) => {
  router.push({
    name: "Process application",
    params: { id: data.id },
    query: { type: data.type },
  });
};

const getTypeTranslation = (type) => {
  switch (type) {
    case "reinstatement":
      return "Заявление на восстановление";
    case "change":
      return "Заявление на изменение условий обучния";
    case "transfer":
      return "Заявление на перевод из другого ВУЗа";
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
  } catch (err) {
    error.value = "Не удалось загрузить заявления. Пожалуйста, попробуйте позже.";
  } finally {
    loading.value = false;
  }

  applications.value = [...applications.value, ...res];
};


const fetchStatuses = async () => {
  const res = await StatusService.fetchAll()
  const mapper = res.reduce((acc, obj) => {
    acc[obj.title] = obj;
    return acc;
  }, {})
  mapper.draft = {title: 'draft', verbose_name: "Черновик"}
  statuses.value = mapper
}

onMounted(async () => {
  await fetchApplications();
  await fetchStatuses();
});


const statusVerboseName = (title) => {
  if (!statuses.value[title]) return title; 
  return String(statuses.value[title].verbose_name);
}

const isCreateButtonShown = () => {
  if (authStore.checkPermissions(["canCreateManySelfApplications"])) {
    return true;
  }
  if (
    authStore.checkPermissions(["canCreateSelfApplication"]) &&
    (applications.value.length === 0 ||
      !applications.value.some((app) => app.status === "new"))
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
