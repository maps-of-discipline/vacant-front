import { api } from './api';

export default class CommentService {
  static async create(comment) {
    const response = await api.post('/comment/', comment);
    return response.data;
  }

  static async removeComment(id) {
    const response = await api.delete(`/comment/${id}`);
    return response.data;
  }

  static async getUserComments() {
    const response = await api.get('/comment/users');
    const res = {};
    for (const [application_id, comments] of Object.entries(response.data)) {
      res[application_id] = comments.sort((a, b) => a.id >= b.id);
    }
    return res;
  }
}
