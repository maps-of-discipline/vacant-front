import { api } from './api';

export default class DocumentService {
  static async getById(id, filename) {
    const response = await api.get('/files/' + id);
    return new File([response.data], filename, { type: response.headers['Content-Type'] });
  }

  static async getTransherPDF(application_id, type) {
    const response = await api.get(`/documents/${type}/${application_id}`, {
      responseType: 'blob',
      headers: {
        'Access-Control-Expose-Headers': '*',
      },
    });

    const contentDisposition = decodeURIComponent(response.headers['content-disposition']);
    let filename = 'transfer.pdf';

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');

        const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
        if (filenameStarMatch && filenameStarMatch[1]) {
          filename = decodeURIComponent(filenameStarMatch[1]);
        }
      }
    }

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    return {
      url,
      filename,
      blob,
    };
  }
}
