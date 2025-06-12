<template>
  <div class="flex flex-column gap-4 page m-auto mt-3">
    <UserForm />
    <Panel
      v-if="authStore.checkPermissions(['canViewApplicationTypeChooseModel'])"
      header="Тип Заявления (отладка)"
      class="flex flex-column"
      toggleable
    >
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
      class="flex flex-column"
      toggleable
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
