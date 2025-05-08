<template>
  <div>
    <Panel
      :header="props.header"
      class="mb-3"
    >
      <div class="flex w-full flex-column">
        <div
          v-for="file in props.files"
          class="flex w-full justify-content-between mb-2"
        >
          <span>{{ file.filename }}</span>
          <a
            :href="file.url"
            :download="file.filename"
            class="p-button-secondary p-button-rounded p-button-sm p-2"
          >
            <i class="pi pi-download"></i>
          </a>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Panel } from 'primevue';
import { defineProps } from 'vue';

const props = defineProps({
  header: String,
  files: Array,
});
</script>

<style scoped></style>
