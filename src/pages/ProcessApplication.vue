<template>
  <div class="content flex">
    <div class="m-auto flex flex-row gap-4">
      <div class="application-page flex flex-row gap-4">
        <CreateApplicationForm
          v-model="applicationData"
          @valid-submit="onValidSubmit"
          :editable="false"
        />
      </div>
      <div class="tools flex flex-column gap-3 w-auto">
        <StatusChangePanel
          :status="applicationData.status"
          :application_id="props.id"
          @statusUpdate="onStatusUpdate"
          @quickmessage="onQuickMessage"
        />
        <RupsNavPanel :application="applicationData" />
        <CommentsListPanel :application_id="props.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";
import CommentsListPanel from "../components/tools/CommentsListPanel.vue";
import StatusChangePanel from "../components/tools/StatusChangePanel.vue";
import RupsNavPanel from "../components/tools/RupsNavPanel.vue";

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
    const response = await ApplicationService.saveApplication(application);
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Заявление успешно сохранено",
      life: 3000,
    });
    await router.push({ name: "SelfApplications" });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "При сохранении заявления произошла ошибка",
      life: 3000,
    });
  }
};

const fetchApplication = async () => {
  if (route.query.type) {
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
      router.push({ name: "Applications" });
    }
    Object.assign(applicationData, app);
  } else {
    router.push({ name: "Applications" });
  }
};

const onStatusUpdate = async (status) => {
  try {
    await ApplicationService.updateStatus(applicationData.id, status);
    applicationData.status = status
  } catch (e){
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось обновить статус заявления",
      life: 3000,
    });
    throw e
  }
  toast.add({
    severity: "success",
    summary: "Успешно",
    detail: "Статус изменен",
    life: 3000,
  });
};

const onQuickMessage = (status) => {
  applicationData.status = status;
};

onBeforeMount(async () => {
  try {
    await Promise.allSettled([fetchApplication()]);
  } catch (error) {
    console.error("Error loading page data:", error);
  }
});
</script>

<style scoped>
.application-page {
  width: 100%;
  max-width: 768px;
  min-width: 530px;
}

.tools {
  max-width: 500px;
  min-width: 300px;
}
</style>
