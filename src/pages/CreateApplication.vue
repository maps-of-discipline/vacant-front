<template>
  <div class="content application-page flex flex-column gap-4">
    <CreateApplicationForm v-model="applicationData" @valid-submit="onValidSubmit" />
  </div>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useToast, Panel } from "primevue";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";

const toast = useToast();
const router = useRouter();
const applicationsStore = useApplicationsStore();

const props = defineProps({
  application: Object
})

const applicationData = reactive({
  header: {},
  type: applicationsStore.applicationType,
  programs: [{}, {}, {}],
  footer: {},
});

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

watch(applicationData, (application, o) => {
  applicationsStore.setDraftApplication({...application, date: new Date().toISOString()});
  console.log("application changed");
});

onBeforeMount(() => {
})
</script>

<style scoped>
.application-page {
  width: 100%;
  max-width: 800px;
  min-width: 530px;
  margin: 0 auto;
}
</style>
