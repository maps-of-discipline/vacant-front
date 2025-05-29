import { ref } from 'vue';
import DocumentService from '../services/documnet';

export function useDownloadPDF() {
  const isLoading = ref(false);

  const downloadPdf = async (id, type) => {
    try {
      isLoading.value = true;
      const { url, filename } = await DocumentService.getTransherPDF(id, type);
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

  return { isLoading, downloadPdf };
}
