import { api, adminApi, adminApiBackend } from "./api.js";
import config from "../config.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


export default class AuthService {
  static redirectToLogin() {
    window.location.href = `${config.admin_api_base}/loginServise?return_url=${config.base_url}/login&service_name=${config.service_name}`;
  }

  static redirectToLoginViaEmail() {
    window.location.href = `${config.admin_api_base}/loginServise/email?return_url=${config.base_url}/login&service_name=${config.service_name}`;
  }

  static async refreshTokens(access, refresh) {
    console.log('refreshing tokens', access, refresh)
    const user_id = jwtDecode(access).user_id
    const response = await axios.post(`${config.admin_api_backend_base}/api/v1/users/refresh`, {
      UserID: user_id, 
      AccessToken: access,
      RefreshToken: refresh,
    });
    
    return {
      access: response.data.access_token,
      refresh: response.data.refresh_token
    }
  }

  static async signUp(user) {
  }
}
