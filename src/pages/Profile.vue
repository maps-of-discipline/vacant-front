<template>
  <div class="flex flex-column gap-4 page m-auto mt-3">
    <UserForm />
    <Panel
      v-if="authStore.checkPermissions(['canViewApplicationTypeChooseModel'])"
      header="Тип Заявления (временно)"
      class="flex flex-column border-2 border-red-100"
      toggleable
      :class="{
        'bg-red-100': !appStore.isDarkMode,
        'bg-red-900 opacity-50': appStore.isDarkMode,
      }"
    >
      <p>Пока не будет готово авто-определение типа заявления</p>
      <div class="m-auto w-fit">
        <SelectButton
          v-model="applicationType"
          size="large"
          :options="['change', 'reinstatement', 'transfer', 'auto']"
        />
      </div>
    </Panel>
    <Panel
      v-if="authStore.checkPermissions(['canViewJWTToken'])"
      header="JWT - токен"
      class="flex flex-column border-2 border-red-100"
      toggleable
      :class="{
        'bg-red-100': !appStore.isDarkMode,
        'bg-red-900 opacity-50': appStore.isDarkMode,
      }"
    >
      <div class="flex">
        <Textarea
          v-model="authStore.auth_data.access"
          class="w-full"
          rows="10"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Panel, SelectButton, Textarea } from 'primevue';
import { useAppStore } from '../store/appStore';
import { onMounted, ref, watch } from 'vue';
import { useApplicationsStore } from '../store/applicationsStore';
import { useAuthStore } from '../store/authStore';
import UserForm from '../components/user/UserForm.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const applicationsStore = useApplicationsStore();

const applicationType = ref('auto');

watch(applicationType, (new_) => {
  applicationsStore.setType(new_);
});

onMounted(() => {
  applicationType.value = applicationsStore.applicationType;
});
</script>

<style scoped>
.page {
  max-width: 600px;
  min-width: 300px;
  width: 100%;
  margin: 0 auto;
}
</style>
