<template>
  <div>
    <Panel :header="props.comment.by" class="mb-3" :class="{ 'stuff-comment': props.type === 'stuff' }">
      <template #icons>
        <Button 
          icon="pi pi-times" 
          rounded 
          size="small" 
          text 
          severity="secondary" 
          @click="emit('remove')"
        />
      </template>
      {{ props.comment.text }}
    </Panel>
  </div>
</template>

<script setup>
import { Panel, Button } from "primevue";
import { defineProps } from "vue";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "user",
  },
});

const emit = defineEmits(['remove'])


</script>

<style scoped>
.stuff-comment {
  border-color: #a88932;
}
</style>
