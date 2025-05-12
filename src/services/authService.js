import { api } from './api.js';
import config from '../config.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserAlreadyExistsError } from '../exceptions/user.js';
import { BadRequestError } from '../exceptions/general.js';

export default class AuthService {
  static redirectToLogin() {
    window.location.href = `${config.admin_api_base}/auth?return_url=${config.base_url}/login&service_name=${config.service_name}`;
  }

  static redirectToLoginViaEmail() {
    window.location.href = `${config.admin_api_base}/auth/email?return_url=${config.base_url}/login&service_name=${config.service_name}`;
  }

  static async refreshTokens(access, refresh) {
    const user_id = jwtDecode(access).user_id;
    const response = await axios.post(`${config.admin_api_backend_base}/api/v1/users/refresh`, {
      UserID: user_id,
      AccessToken: access,
      RefreshToken: refresh,
    });

    return {
      access: response.data.access_token,
      refresh: response.data.refresh_token,
    };
  }

  static async signUp(user) {
    try {
      await api.post('/users/create', user);
    } catch (error) {
      if (
        error?.response.status === 400 &&
        error?.response.data?.detail.includes('already exists')
      ) {
        throw new UserAlreadyExistsError(`User with email ${user.email} already exists`);
      }

      if (error?.response.status === 400) {
        throw new BadRequestError('Error occured during user creation');
      }
    }
    // this.redirectToLoginViaEmail()
  }
}
