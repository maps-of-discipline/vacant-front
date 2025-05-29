<template>
  <div class="card flex mb-3 p-2 pb-3">
    <div class="flex flex-column w-full">
      <span class="font-bold text-lg mb-2">{{ props.type }}</span>
      <div class="flex align-items-center">
        <i class="pi pi-calendar mr-2"></i>
        <span class="mr-3">{{ props.date }}</span>
        <i class="pi pi-tag mr-2"></i>
        <Tag
          :value="props.status"
          :class="[...props.statusClass, 'text-sm px-2 py-1']"
        />
      </div>
    </div>
    <div class="flex align-items-center">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { Tag } from 'primevue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },

  statusClass: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
.new-status-color {
  background-color: rgba(from var(--p-blue-500) r g b / 0.2);
}

.approved-status-color {
  background-color: rgba(from var(--p-green-500) r g b / 0.2);
}

.rejected-status-color {
  background-color: rgba(from var(--p-red-500) r g b / 0.2);
}

.draft-status-color {
  background-color: rgba(from var(--p-gray-500) r g b / 0.2);
}
</style>

