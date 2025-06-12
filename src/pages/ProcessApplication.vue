<template>
  <div class="content flex">
    <div class="m-auto flex flex-row gap-4">
      <div class="application-page flex flex-row gap-4">
        <CreateApplicationForm
          v-model="applicationData"
          :staff-mode="true"
          :editable="false"
          @valid-submit="onValidSubmit"
        />
      </div>
      <div class="tools flex flex-column gap-3 w-auto">
        <StatusChangePanel
          v-model:comments="comments"
          :status="applicationData.status"
          :application_id="props.id"
          @status-update="onStatusUpdate"
        />
        <RupsNavPanel :application="applicationData" />
        <CommentsListPanel
          v-model="comments"
          :application-id="props.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Toast from '../tools/toast.js';
import CreateApplicationForm from '../components/application/CreateApplicationForm.vue';
import ApplicationService from '../services/applicationService.js';
import { useApplicationsStore } from '../store/applicationsStore.js';
import CommentsListPanel from '../components/tools/CommentsListPanel.vue';
import StatusChangePanel from '../components/tools/StatusChangePanel.vue';
import RupsNavPanel from '../components/tools/RupsNavPanel.vue';

const toast = new Toast();
const router = useRouter();
const route = useRoute();
const applicationsStore = useApplicationsStore();

const comments = ref([]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const applicationData = reactive({
  header: {},
  type: applicationsStore.getApplicationType,
  programs: [{}, {}, {}],
  footer: {},
});

const onValidSubmit = async (application) => {
  try {
    await ApplicationService.saveApplication(application);
    toast.success('Заявление успешно сохранено');
    await router.push({ name: 'SelfApplications' });
  } catch (error) {
    console.error(error);
    toast.error('При сохранении заявления произошла ошибка');
  }
};

const fetchApplication = async () => {
  if (route.query.type) {
    let app;
    try {
      app = await ApplicationService.getApplication(props.id, route.query.type);
    } catch (error) {
      toast.error('Не удаось загрузить заявление.');
      console.error(error);
      router.push({ name: 'Applications' });
    }
    Object.assign(applicationData, app);
  } else {
    router.push({ name: 'Applications' });
  }
};

const onStatusUpdate = async (status) => {
  try {
    await ApplicationService.updateStatus(applicationData.id, status);
    applicationData.status = status;
  } catch (e) {
    toast.error('Не удалось обновить статус заявления');
    throw e;
  }
  toast.success('Статус обновлен');
};

onBeforeMount(async () => {
  try {
    await Promise.allSettled([fetchApplication()]);
  } catch (error) {
    toast.error('Не удалось загрузить заявления');
    console.error('Error loading page data:', error);
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
