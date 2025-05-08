import { api } from './api';

export default class DocumentService {
  static async getById(id, filename) {
    const response = await api.get('/files/' + id);
    return new File([response.data], filename, { type: response.headers['Content-Type'] });
  }
}
