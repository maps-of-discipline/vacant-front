<template>
  <Button
    v-if="comments.length > 0"
    size="small"
    rounded
    icon="pi pi-comment"
    severity="secondary"
    @click="() => (isVisible = true)"
  />
  <div>
    <Dialog
      v-model:visible="isVisible"
      modal
      header="Комментарии"
      class="xs:w-12 sm:w-10 md:w-8 lg:w-6 xl:w-4"
    >
      <CommentWidget
        v-model="comments"
        :can-delete-comments="false"
        :application-id="props.applicationId"
        :can-create-stuff-comments="false"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';
import { Button, Dialog } from 'primevue';
import CommentWidget from '../UI/CommentWidget.vue';

const isVisible = ref(false);
const comments = defineModel('comments', {
  type: Array,
  default: () => [],
});

const props = defineProps({
  applicationId: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.comments-modal {
  max-width: 800px;
}
</style>
