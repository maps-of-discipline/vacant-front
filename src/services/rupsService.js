import { api } from './api';

export default class RupService {
  static async getRups(source, target) {
    const response = await api.post('/rups/get', {
      source,
      target,
    });

    return response.data;
  }

  static async updateChoosen(parent_id, child_id, state) {
    const response = await api.post('/rups/set-choosen', {
      target_id: parent_id,
      variant_id: child_id,
      value: state,
    });
    return response.data;
  }
}
