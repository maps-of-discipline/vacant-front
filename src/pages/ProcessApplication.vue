<template>
  <div class="content flex">
    <div class="m-auto flex flex-row gap-4">
      <div class="application-page flex flex-row gap-4">
        <CreateApplicationForm v-model="applicationData" @valid-submit="onValidSubmit" :editable="false" />
      </div>
      <div class="tools flex flex-column gap-3 w-auto">
        <Panel header="Статус">
          <div class="flex flex-row align-items-center">
            <span class="mr-1">Текущий:</span>
            <Skeleton height="1rem" class="w-3" v-if="!currentStatus"></Skeleton>
            <Tag :class="[
              'status-label',
              AppService.getStatusClass(currentStatus.title),
            ]" :value="currentStatus.verbose_name" v-else />
          </div>
          <Divider />
          <p>Поменять на:</p>
          <div class="inline-flex flex-wrap" style="
              width: fit-content !important;
              max-width: max-content !important;
            ">
            <Button v-for="status in unchoosedStatuses" size="small" :label="status.verbose_name"
              class="justify-content-start p-1 mr-2 mb-2" :class="[AppService.getStatusClass(status.title)]" />
          </div>

          <div v-for="status in statusesWithMessages" class="mt-3">
            <Divider />
            <span>{{ status.verbose_name }}</span>
            <div class="flex flex-column gap-2 mt-3" v-if="status.messages.length > 0">
              <Button size="small" severity="secondary" :label="message" class="justify-content-start p-1"
                v-for="message in status.messages" />
            </div>
          </div>
        </Panel>
        <CommentsListPanel :application_id='props.id'/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  useToast,
  Panel,
  Tag,
  Divider,
  Skeleton,
  Button,
} from "primevue";
import CreateApplicationForm from "../components/application/CreateApplicationForm.vue";
import ApplicationService from "../services/applicationService.js";
import { useApplicationsStore } from "../store/applicationsStore.js";
import StatusService from "../services/statusService.js";
import AppService from "../services/appService.js";
import CommentsListPanel from "../components/tools/CommentsListPanel.vue";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const applicationsStore = useApplicationsStore();

const props = defineProps({
  id: Number,
});

const statuses = ref([]);

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
  applicationsStore.setDraftApplication({
    ...application,
    date: new Date().toISOString(),
  });
  console.log("application changed");
});

const currentStatus = computed(() => {
  if (!statuses.value || !applicationData.status) return false;
  return statuses.value.find((el) => el.title == applicationData.status);
});

const statusesWithMessages = computed(() => {
  if (!currentStatus) return statuses;
  return statuses.value.filter((el) => el.messages.length > 0);
});

const unchoosedStatuses = computed(() => {
  if (!currentStatus) return statuses.value;
  return statuses.value.filter((el) => el.title != currentStatus.value.title);
});

const fetchStatuses = async () => {
  const resp = await StatusService.fetchAll();
  statuses.value = resp;
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

onBeforeMount(async () => {
  try {
    await Promise.allSettled([
      fetchApplication(),
      fetchStatuses(),
    ]);
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
