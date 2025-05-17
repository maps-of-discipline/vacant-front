<template>
  <div class="flex flex-column align-items-end">
    <CommentList
      :comments="comments"
      :can-delete-comments="props.canDeleteComments"
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
      v-if="saveCommentConfig.length > 0"
      size="small"
      label="Сохранить"
      icon="pi pi-eye"
      :model="saveCommentConfig"
      @click="onAddComment('user')"
    />
    <Button
      v-else
      size="small"
      label="Сохранить"
      icon="pi pi-eye"
      :loading="isProcessingNewComment"
      :disabled="!newComment"
      @click="onAddComment('user')"
    />
  </div>
</template>

<script setup>
import { FloatLabel, Textarea, SplitButton, Button } from 'primevue';
import { onMounted, ref } from 'vue';
import CommentList from '../UI/CommentList.vue';
import ApplicationService from '../../services/applicationService';
import CommentService from '../../services/commentService.js';
import Toast from '../../tools/toast.js';

const comments = defineModel({
  type: Array,
  default: () => [],
});

const props = defineProps({
  applicationId: {
    type: Number,
    required: true,
  },
  canCreateStuffComments: {
    type: Boolean,
    default: () => false,
  },
  canDeleteComments: {
    type: Boolean,
    default: () => false,
  },
});

const toast = new Toast();

const newComment = ref('');
const isProcessingNewComment = ref(false);
const saveCommentConfig = [];

if (props.canCreateStuffComments)
  saveCommentConfig.push({
    label: 'Сохранить для сотрудников',
    icon: 'pi pi-eye-slash',
    command: () => onAddComment('stuff'),
  });

const fetchComments = async () => {
  const [users, stuff] = await Promise.all([
    ApplicationService.getCommnets(props.applicationId, 'user'),
    ApplicationService.getCommnets(props.applicationId, 'stuff'),
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
  if (!newComment.value || isProcessingNewComment.value) {
    return null;
  }

  isProcessingNewComment.value = true;

  let created_comment;
  try {
    created_comment = await CommentService.create({
      application_id: props.applicationId,
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
  isProcessingNewComment.value = false;
};

onMounted(async () => {
  if (comments.value.length == 0) await fetchComments();
});
</script>
