<template>
  <div
    :class="{
      'pl-4': authStore.payload.user_id == comment.by_id,
      'pr-4': authStore.payload.user_id != comment.by_id,
    }"
  >
    <Panel
      :header="props.comment.by"
      class="mb-3 w-fit"
      :class="{
        'stuff-comment': props.type === 'stuff',
        'ml-auto': authStore.payload.user_id == comment.by_id,
      }"
    >
      <template #icons>
        <div class="pl-3">
          <Button
            v-if="authStore.payload.user_id == comment.by_id && canDeleteComments"
            icon="pi pi-times"
            rounded
            size="small"
            text
            severity="secondary"
            @click="emit('remove')"
          />
        </div>
      </template>
      {{ props.comment.text }}
    </Panel>
  </div>
</template>

<script setup>
import { Panel, Button } from 'primevue';
import { defineProps } from 'vue';
import { useAuthStore } from '../../store/authStore';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: 'user',
  },

  canDeleteComments: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits(['remove']);
const authStore = useAuthStore();
</script>

<style scoped>
.stuff-comment {
  border-color: #a88932;
}
</style>
