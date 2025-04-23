import { api } from "./api"


export default class CommentService {
  static async create(comment) {
    const response = await api.post("/comment/", comment)
    return response.data
  }

  static async removeComment(id) {
    const response = await api.delete(`/comment/${id}`)
    return response.data
  }
}
