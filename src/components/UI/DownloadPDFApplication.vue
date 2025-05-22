<template>
  <div>
    <Button
      v-if="isShown(props.type)"
      rounded
      severity="secondary"
      icon="pi pi-file-pdf"
      size="small"
      :loading="isLoading"
      @click="downloadPdf()"
    />
  </div>
</template>

<script setup>
import { Button } from 'primevue';
import { ref } from 'vue';
import DocumentService from '../../services/documnet';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});
const isLoading = ref(false);

const isShown = (type) => {
  return type == 'transfer';
};

const downloadPdf = async () => {
  try {
    isLoading.value = true;
    const { url, filename} = await DocumentService.getTransherPDF(props.id);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
