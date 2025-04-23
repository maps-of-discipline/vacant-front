<template>
  <ScrollPanel class="mb-4 p-2" style="width: 100%; height: 300px">
    <Comment 
      v-for='comment in orderedComments' 
      :comment='comment' 
      :type="comment.scope"
      @remove='emit("remove", comment.id)'
    />
  </ScrollPanel>
</template>

<script setup>
import Comment from "./Comment.vue"
import { ScrollPanel, useToast } from "primevue";
import { defineProps, defineEmits, computed } from "vue";

const emit = defineEmits(['remove'])

const props = defineProps({
  comments: {
    type: Array, 
    required: true
  }
});


const orderedComments = computed(() => {
  const priority = {
    "stuff": 2,
    "user": 1, 
  }

  const ordered = props.comments.sort((a, b) => priority[a.scope] < priority[b.scope])
  return ordered
})

// const onCommentRemove = async (comment_id) => {
//   try {
//     await CommentService.removeComment(comment_id)
//   } catch (error) {
//     toast.add({
//       severity: "error",
//       summary: "Ошибка",
//       detail: "Не удалось удалить комментарий",
//       life: 3000,
//     })
//     return 
//   } 
//
//   props.comments = props.comments.filter((el) => el.id != comment_id)
// }

</script>
