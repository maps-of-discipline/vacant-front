<template>
  <div class="content application-page flex flex-column gap-4">
    <CreateApplicationForm v-model="applicationData" @valid-submit="onValidSubmit" />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";

const toast = useToast();
const router = useRouter();
const applicationsStore = useApplicationsStore();

const applicationData = reactive({ type: applicationsStore.applicationType });

const onValidSubmit = async (application) => {
  try {
    const response = await ApplicationService.saveApplication(application);
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Заявление успешно сохранено",
      life: 3000,
    });
    await router.push({ name: "SelfApplications" });
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "При сохранении заявления произошла ошибка",
      life: 3000,
    });
  }
};

watch(applicationData, (n, o) => {
  applicationsStore.setDraftApplication(n);
  console.log("application changed");
});
</script>

<style scoped>
.application-page {
  width: 100%;
  max-width: 800px;
  min-width: 530px;
  margin: 0 auto;
}
</style>
