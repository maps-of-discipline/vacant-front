<template>
  <div>
    <Panel header="Комментарии">
      <div class="flex flex-column align-items-end">
        <CommentList :comments="comments" @remove="onCommentRemove" />
        <FloatLabel variant="on" class="pb-3 w-full">
          <Textarea id="over_label" rows="3" class="w-full" v-model="newComment" />
          <label for="on_label">Комментарий</label>
        </FloatLabel>
        <SplitButton size="small" label="Сохранить" icon="pi pi-eye" @click="onAddComment('user')"
          :model="saveCommentConfig" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Panel, FloatLabel, Textarea, SplitButton, useToast } from "primevue";
import { onBeforeMount, ref } from "vue";
import CommentList from "../UI/CommentList.vue";
import ApplicationService from "../../services/applicationService";
import CommentService from "../../services/commentService.js";

const props = defineProps({
  application_id: Number,
});

const toast = useToast();

const comments = ref([]);
const newComment = ref("");
const saveCommentConfig = [
  {
    label: "Сохранить для сотрудников",
    icon: "pi pi-eye-slash",
    command: () => onAddComment('stuff'),
  },
];

const fetchComments = async () => {
  const [users, stuff] = await Promise.all([
    ApplicationService.getCommnets(props.application_id, "user"),
    ApplicationService.getCommnets(props.application_id, "stuff"),
  ]);

  comments.value = [...users, ...stuff];
};

const onCommentRemove = async (comment_id) => {
  try {
    await CommentService.removeComment(comment_id);
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось удалить комментарий",
      life: 3000,
    });
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
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось добавить комментарий",
      life: 3000,
    });
    return;
  }
  toast.add({
    severity: "success",
    summary: "Комментарий успешно добавлен",
    life: 3000,
  });
  
  newComment.value = "";
  comments.value.push(created_comment);
};

onBeforeMount(async () => {
  await fetchComments();
});
</script>
