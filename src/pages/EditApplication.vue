<template>
  <div class="content application-page flex flex-column gap-4">
    <CreateApplicationForm 
      v-model="applicationData" 
      :isEdit="true" 
      @valid-submit="onValidSubmit" />
  </div>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast, Panel } from "primevue";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const applicationsStore = useApplicationsStore();

const props = defineProps({
  id: Number,
});


const applicationData = reactive({
  header: {},
  type: applicationsStore.applicationType,
  programs: [{}, {}, {}],
  footer: {},
});

const onValidSubmit = async (application) => {
  try {
    const response = await ApplicationService.updateApplication(application);
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Заявление успешно сохранено",
      life: 3000,
    });
    applicationsStore.setDraftApplication(null)
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

watch(applicationData, (application) => {
  if (props.id == 0) {
    applicationsStore.setDraftApplication({
      ...application,
      date: new Date().toISOString(),
    });
  }
});


onBeforeMount(async () => {
  if (props.id == 0) {
    Object.assign(applicationData, applicationsStore.draftApplication);
  } else if (route.query.type) {
    let app;

    try {
      app = await ApplicationService.getApplication(props.id, route.query.type);
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Не удаось загрузить заявление.",
        life: 3000,
      });
      console.error(error);
      router.push({ name: "SelfApplications" });
    }

    Object.assign(applicationData, app);
  } else {
    router.push({ name: "SelfApplications" });
  }
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
