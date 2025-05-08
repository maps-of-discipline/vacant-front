<template>
  <div>
    <Panel header="Комментарии">
      <div class="flex flex-column align-items-end">
        <CommentList
          :comments="comments"
          @remove="onCommentRemove"
        />
        <FloatLabel
          variant="on"
          class="pb-3 w-full"
        >
          <Textarea
            id="over_label"
            v-model="newComment"
            rows="3"
            class="w-full"
          />
          <label for="on_label">Оставить комментарий</label>
        </FloatLabel>
        <SplitButton
          size="small"
          label="Сохранить"
          icon="pi pi-eye"
          :model="saveCommentConfig"
          @click="onAddComment('user')"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Panel, FloatLabel, Textarea, SplitButton } from 'primevue';
import { onMounted, onUnmounted, ref } from 'vue';
import CommentList from '../UI/CommentList.vue';
import ApplicationService from '../../services/applicationService';
import CommentService from '../../services/commentService.js';
import Toast from '../../tools/toast.js';
import emitter from '../../eventBus.js';

const props = defineProps({
  application_id: {
    type: Number,
    required: true,
  },
});

const toast = new Toast();

const comments = ref([]);
const newComment = ref('');
const saveCommentConfig = [
  {
    label: 'Сохранить для сотрудников',
    icon: 'pi pi-eye-slash',
    command: () => onAddComment('stuff'),
  },
];

const fetchComments = async () => {
  const [users, stuff] = await Promise.all([
    ApplicationService.getCommnets(props.application_id, 'user'),
    ApplicationService.getCommnets(props.application_id, 'stuff'),
  ]);

  comments.value = [...users, ...stuff];
};

const onCommentRemove = async (comment_id) => {
  try {
    await CommentService.removeComment(comment_id);
  } catch {
    toast.error('Не удалось удалить комментарий');
    return;
  }

  comments.value = comments.value.filter((el) => el.id != comment_id);
};

const onAddComment = async (scope) => {
  let created_comment;
  try {
    created_comment = await CommentService.create({
      application_id: props.application_id,
      text: newComment.value,
      scope: scope,
    });
  } catch {
    toast.error('Не удалось добавить комментарий');
    return;
  }
  toast.success('Комментарий успешно добавлен');

  newComment.value = '';
  comments.value.push(created_comment);
};

const onAddCommentGlovalEvent = (newComment) => {
  comments.value.push(newComment);
};

onMounted(async () => {
  await fetchComments();
  emitter.on('comment-added', onAddCommentGlovalEvent);
});

onUnmounted(() => {
  emitter.off('comment-added', onAddCommentGlovalEvent);
});
</script>
