import { api } from './api.js';
export default class StatusService {
  static async fetchAll() {
    const response = await api.get('/status/all');
    return response.data;
  }
}
