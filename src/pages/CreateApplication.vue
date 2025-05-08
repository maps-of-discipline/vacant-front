<template>
  <div class="content application-page flex flex-column gap-4">
    <CreateApplicationForm 
      v-model="applicationData" 
      @valid-submit="onValidSubmit" 
      :isEdit='true'
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { Panel, } from "primevue";
import Toast from "../tools/toast.js";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";

const toast = new Toast();
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
  files: {},
});

const onValidSubmit = async (application) => {
  try {
    await ApplicationService.saveApplication(application);
    toast.success("Заявление успешно сохранено");
    applicationsStore.setDraftApplication(null);
    await router.push({ name: "SelfApplications" });
  } catch (error) {
    toast.error("При сохранении заявления произошла ошибка");
    throw error
  }
};

watch(applicationData, (application, o) => {
  applicationsStore.setDraftApplication({...application, date: new Date().toISOString()});
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
