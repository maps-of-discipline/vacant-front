<script setup>
import {ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import {Column, DataTable, Button} from 'primevue';
import {useAuthStore} from '../store/authStore.js'
import { useAppStore } from '../store/appStore.js';
import AuthService from '../services/authService.js';
import ApplicationService from '../services/applicationService.js';

const applications = ref([])
const loading = ref(true)
const error = ref(null)

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

const getStatusClass = (status) => {
  switch(status) {
    case 'new': 
      return appStore.isDarkMode ? 'new-status-color text-blue-300' : 'bg-blue-100 text-blue-900';
    case 'approved': 
      return appStore.isDarkMode ? 'approved-status-color text-green-300' : 'bg-green-100 text-green-900';
    case 'rejected': 
      return appStore.isDarkMode ? 'rejected-status-color text-red-300' : 'bg-red-100 text-red-900';
    default: 
      return appStore.isDarkMode ? 'text-gray-100' : 'bg-gray-100 text-gray-900';
  }
}

const getStatusTranslation = (status) => {
  switch(status) {
    case 'new': return 'Новое';
    case 'approved': return 'Одобрено';
    case 'rejected': return 'Отклонено';
    default: return status;
  }
}

const getTypeTranslation = (type) => {
  switch(type) {
    case 'reinstatement': return 'Заявление на восстановление';
    case 'change': return 'Заявление на изменение условий обучния';
    case 'transfer': return 'Заявление на перевод из другого ВУЗа';
    // Add more type translations as needed
    default: return type;
  }
}

const fetchApplications = async () => {
  loading.value = true
  error.value = null
  
  try {
    applications.value = await ApplicationService.fetchUserApplications()
    console.log('asdfasdf', applications.value)
  } catch (err) {
    console.error('Error fetching applications:', err)
    error.value = 'Не удалось загрузить заявления. Пожалуйста, попробуйте позже.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchApplications()
})

  
const isCreateButtonShown = () => {
  if (authStore.checkPermissions(['canCreateManySelfApplications'])) {
    return true
  }
  if (authStore.checkPermissions(['canCreateSelfApplication']) && (applications.value.length === 0 || !applications.value.some(app => app.status === 'new'))) {
    return true
  }
  return false
}


</script>

<template>
  <div class="content w-10 surface-0 m-auto p-3 flex flex-column border-round">
    <!-- Loading state -->
    <div class="flex justify-content-center p-4" v-if="loading">
      <i class="pi pi-spin pi-spinner text-2xl"></i>
    </div>
    
    <!-- Error state -->
    <div class="flex justify-content-center p-4 text-red-500" v-else-if="error">
      {{ error }}
    </div>
    
    <!-- Data table -->
    <DataTable
        :value="applications"
        tableStyle="min-width: 50rem"
        v-else-if="applications.length > 0"
        stripedRows
        paginator
        :rows="5"
        class="p-datatable-sm custom-table"
    >
      <Column field="type" header="Тип заявления">
        <template #body="slotProps">
          {{ getTypeTranslation(slotProps.data.type) }}
        </template>
      </Column>
      <Column field="date" class="w-2" headerClass="text-center" bodyClass="text-center">
        <template #header>
          <span class="m-auto font-bold">Дата подачи</span>
        </template>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>
      
      <Column field="status" class="w-2" headerClass="text-center" bodyClass="text-center">
        <template #header>
          <span class="m-auto font-bold">Статус</span>
        </template>
        <template #body="slotProps">
          <span :class="['status-badge w-full py-1 px-2 border-round', getStatusClass(slotProps.data.status)]">
            {{ getStatusTranslation(slotProps.data.status) }}
          </span>
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
        @click="router.push({name: 'Create Application'})"
    >
      <Button label="Подать заявление" icon="pi pi-plus"/>
    </div>
  </div>
</template>

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
</style>