import { api, adminApi, adminApiBackend} from "./api.js";
import config from "../config.js";


export default class AuthService {
  static redirectToLogin() {
      window.location.href = `${config.admin_api_base}/loginServise?return_url=${config.base_url}/login&service_name=vacant`;
  }

  static logout() {
    // TODO: implement
    localStorage.removeItem("token");
  }

  static async fetchUser(token) {
    const response = await adminApiBackend.get("/api/v1/users/me")
    return response.data;
  }
}
