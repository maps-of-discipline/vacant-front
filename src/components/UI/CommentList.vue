<template>
  <div
    v-if="props.comments.length > 0"
    class="flex flex-column w-full"
  >
    <ScrollPanel
      class="mb-4 p-2"
      style="width: 100%; height: 300px"
    >
      <Comment
        v-for="comment in orderedComments"
        :key="comment.id"
        :comment="comment"
        :type="comment.scope"
        :can-delete-comments="props.canDeleteComments"
        @remove="emit('remove', comment.id)"
      />
    </ScrollPanel>
  </div>
</template>

<script setup>
import Comment from './Comment.vue';
import { ScrollPanel } from 'primevue';
import { defineProps, defineEmits, computed } from 'vue';

const emit = defineEmits(['remove']);

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },

  canDeleteComments: {
    type: Boolean,
    default: () => false,
  },
});

const orderedComments = computed(() => {
  const priority = {
    stuff: 2,
    user: 1,
  };

  let ordered = props.comments;
  ordered = ordered.sort((a, b) => priority[a.scope] < priority[b.scope]);
  return ordered;
});
</script>
