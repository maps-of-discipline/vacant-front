import { ref } from 'vue';

export function useDownloadFile(href) {
  const isLoading = ref(false);
  let url = href;

  const downloadFile = async () => {
    try {
      isLoading.value = true;

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Решение по ЗВМ.docx');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const setUrl = (href) => {
    url = href;
  };

  return { isLoading, downloadFile, setUrl };
}
