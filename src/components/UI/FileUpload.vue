<template>
  <Panel
    :header="title"
    class="mb-3"
  >
    <p class="text-sm text-500 mb-3 mt-2">
      {{ description }}
    </p>
    <div
      v-if="!multiple"
      class="file-row flex align-items-center p-2 border-0 border-round-sm surface-50 mb-3"
      :class="{ 'p-invalid': showValidationErrors && required && !hasFiles }"
    >
      >
      <div
        v-if="modelValue && modelValue.length > 0"
        class="flex-1 flex align-items-center"
      >
        <i class="pi pi-file text-primary mr-2"></i>
        <span class="text-truncate">{{ modelValue[0].name }}</span>
      </div>
      <div
        v-else
        class="flex-1 text-500"
      >
        <span>Файл не выбран</span>
      </div>

      <div>
        <Button
          v-if="props.editable && modelValue && modelValue.length > 0"
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          aria-label="Удалить файл"
          @click="removeFile(0)"
        />
        <Button
          v-else-if="editable"
          label="Загрузить"
          icon="pi pi-upload"
          size="small"
          outlined
          @click="triggerFileInput()"
        />
        <Button
          v-if="isDownloadBtnShown"
          icon="pi pi-download"
          rounded
          size="small"
          severity="secondary"
          @click="onDownloadClick(modelValue[0])"
        />
      </div>
    </div>

    <div v-else>
      <div
        v-for="(file, fileIndex) in modelValue"
        :key="fileIndex"
        class="file-row flex align-items-center p-2 pl-3 border-0 border-round-sm surface-50 mb-2"
        :class="{ 'p-invalid': showValidationErrors && required && !hasFiles && fileIndex === 0 }"
      >
        <div class="flex-1 flex align-items-center">
          <i class="pi pi-file text-primary mr-2"></i>
          <span class="text-truncate">{{ file.name }}</span>
        </div>
        <Button
          v-if="editable"
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          aria-label="Удалить файл"
          @click="removeFile(fileIndex)"
        />
        <Button
          v-if="isDownloadBtnShown"
          icon="pi pi-download"
          rounded
          size="small"
          severity="secondary"
          @click="onDownloadClick(file)"
        />
      </div>

      <div class="flex justify-content-end mt-3">
        <Button
          v-if="editable"
          label="Добавить файл"
          icon="pi pi-plus"
          size="small"
          outlined
          @click="triggerFileInput()"
        />
      </div>
    </div>

    <Message
      v-if="showValidationErrors && required && !hasFiles"
      severity="error"
      variant="simple"
      size="small"
      class="mt-2"
    >
      {{ validationMessage }}
    </Message>

    <input
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="accept"
      class="hidden-file-input"
      @change="onFileSelected"
    />
  </Panel>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Message from 'primevue/message';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: 'application/pdf,image/*',
  },
  required: {
    type: Boolean,
    default: false,
  },
  showValidationErrors: {
    type: Boolean,
    default: false,
  },
  validationMessage: {
    type: String,
    default: 'Необходимо загрузить файл',
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'update:isValid']);

const fileInput = ref(null);

const hasFiles = computed(() => {
  return props.modelValue && props.modelValue.length > 0;
});

const hasUploaded = ref(false);

const isDownloadBtnShown = computed(() => {
  return props.modelValue.length > 0 && !hasUploaded.value;
});

const isValid = computed(() => {
  if (props.required) {
    return hasFiles.value;
  }
  return true;
});

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const onFileSelected = (event) => {
  const selectedFiles = Array.from(event.target.files);
  hasUploaded.value = true;

  if (props.multiple) {
    emit('update:modelValue', [...(props.modelValue || []), ...selectedFiles]);
  } else {
    emit('update:modelValue', [selectedFiles[0]]);
  }

  // Reset the input to allow selecting the same file again
  event.target.value = '';
};

const removeFile = (fileIndex) => {
  const updatedFiles = [...props.modelValue];
  updatedFiles.splice(fileIndex, 1);
  emit('update:modelValue', updatedFiles);
};

const onDownloadClick = (file) => {
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Watch for changes in validation status
watch(
  isValid,
  (valid) => {
    emit('update:isValid', valid);
  },
  { immediate: true }
);
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 350px;
}

.hidden-file-input {
  display: none;
}

.file-row {
  min-height: 3rem;
}

.p-invalid {
  border: 1px solid var(--red-500) !important;
}

:deep(.p-message) {
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-message-wrapper) {
  padding: 0.25rem 0;
}
</style>
