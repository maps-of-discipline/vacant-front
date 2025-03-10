import axios from "axios";
import AuthService from "./authService.js";
import { useAuthStore } from "../store/authStore.js";
import config from "../config";


const api = axios.create({
  baseURL: config.vacant_api_base,
  timeout: 10000,
});

const adminApi = axios.create({
  baseURL: config.admin_api_base,
  timeout: 10000,
});

const adminApiBackend = axios.create({
    baseURL: config.admin_api_backend_base,
    timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


adminApiBackend.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.admin_api_token
        if (token) {
            config.headers.Authorization = token;
        }
        return config
    },
    (error) => Promise.reject(error),
);

export  { api, adminApi, adminApiBackend};
