<template>
  <div class="content application-page flex flex-column gap-4">
    <Panel
        header="Тип Заявления (временно)"
        class="flex flex-column border-2 border-red-100"
        :class="{
          'bg-red-100': !appStore.isDarkMode,
          'bg-red-900 opacity-50': appStore.isDarkMode,
        }"
      >
        <p>Пока не будет готово авто-определение типа заявления</p>
        <div class="m-auto w-fit">
          <SelectButton
            size="large"
            v-model="applicationType"
            :options="['change', 'reinstatement', 'transfer']"
          />
        </div>
      </Panel>
    <CreateApplicationForm 
      v-model="applicationData" 
      @valid-submit="onValidSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { Panel, SelectButton } from 'primevue'
import { useAppStore } from '../store/appStore.js';
import CreateApplicationForm from '../components/application/CreateApplicationForm.vue';

const appStore = useAppStore();


const applicationType = ref('change');
const applicationData = ref({ type: 'change' });

watch(applicationType, (newType) => {
  applicationData.value = {type: newType}
});


const onValidSubmit = async (application) => {

  try {
    const response = await ApplicationService.saveApplication(
      application.value,
    );
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Заявление успешно сохранено",
      life: 3000,
    });
    await router.push({ name: "SelfApplications" });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "При сохранении заявления произошла ошибка",
      life: 3000,
    });
  }
}
</script>

<style scoped>
.application-page {
  width: 100%;
  max-width: 800px;
  min-width: 530px;
  margin: 0 auto;
}
</style>

