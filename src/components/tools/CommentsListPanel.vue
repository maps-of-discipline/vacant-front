<template>
  <div>
    <Panel header="Комментарии для внутреннего использования">
      <CommentWidget
        v-model="comments"
        :can-delete-comments="true"
        :application-id="props.applicationId"
        :can-create-stuff-comments="true"
        :only-staff-comments="true"
      />
    </Panel>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Panel } from 'primevue';
import ApplicationService from '../../services/applicationService';
import CommentWidget from '../UI/CommentWidget.vue';

const props = defineProps({
  applicationId: {
    type: Number,
    required: true,
  },
});

const comments = defineModel({
  type: Array,
  default: () => [],
});

const fetchComments = async () => {
  const [users, stuff] = await Promise.all([
    ApplicationService.getCommnets(props.applicationId, 'user'),
    ApplicationService.getCommnets(props.applicationId, 'stuff'),
  ]);

  comments.value = [...users, ...stuff];
};

onMounted(async () => {
  await fetchComments();
});
</script>
