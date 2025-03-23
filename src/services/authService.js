import { api, adminApi, adminApiBackend } from "./api.js";
import config from "../config.js";


export default class AuthService {
  static redirectToLogin() {
    window.location.href = `${config.admin_api_base}/loginServise?return_url=${config.base_url}/login&service_name=vacant`;
  }

  static logout() {
    // TODO: implement
    localStorage.removeItem("token");
  }

  static async authWithAdminApiToken(token) {
    console.log('auth service', token);
    const response = await api.post("users/login/admin_api", { token: token })
    console.log(response)
    return {
      access: response.data.access_token,
      refresh: response.data.refresh_token
    };
  }

  static async refreshTokens(tokens) {
    console.log('AuthService: refreshing tokens')
    const response = await api.post("users/login/renew", {
      access_token: tokens.access,
      refresh_token: tokens.refresh,
    });

    return {
      access: response.data.access_token,
      refresh: response.data.refresh_token
    }
  }

  static async signUp(user) {
    console.log('signInWithEmail', user);

    const res = await api.post("users/sign-up", user)
    return {
      access: res.data.access_token,
      refresh: res.data.refresh_token
    }
  }

  static async signInWithEmail(email) {
    console.log('signInWithEmail', email);

    const res = await api.post("users/sign-in", { email })
    return {
      access: res.data.access_token,
      refresh: res.data.refresh_token
    }
  }
}
