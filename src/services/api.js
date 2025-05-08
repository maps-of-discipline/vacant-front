import axios from 'axios';
import config from '../config';
import AuthService from './authService.js';
import { useAuthStore } from '../store/authStore.js';
import { useRouter } from 'vue-router';

const router = useRouter();

export const api = axios.create({
  baseURL: config.vacant_api_base,
  timeout: 10000,
});

export const adminApi = axios.create({
  baseURL: config.admin_api_base,
  timeout: 10000,
});

export const adminApiBackend = axios.create({
  baseURL: config.admin_api_backend_base,
  timeout: 10000,
});

export const mapsApi = axios.create({
  baseURL: config.maps_api_base,
  timeout: 10000,
});

const authInterceptor = async (config) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    if (authStore.isTokenExpired()) {
      try {
        const auth_data = await AuthService.refreshTokens(
          authStore.auth_data.access,
          authStore.auth_data.refresh
        );
        authStore.setAuthData(auth_data.access, auth_data.refresh);
      } catch (error) {
        console.error(error);
        authStore.logout();
        router.push({ name: 'Login' });
        throw error;
      }
    }
    config.headers.Authorization = `Bearer ${authStore.auth_data.access}`;
  }
  return config;
};

// Move interceptors to this setup function
api.interceptors.request.use(authInterceptor, (error) => {
  console.error(error);
  Promise.reject(error);
});

adminApiBackend.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
