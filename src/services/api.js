import axios from "axios";
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
});

const mapsApi = axios.create({
  baseURL: config.maps_api_base,
  timeout: 10000, 
})

// Move interceptors to this setup function
export function setupInterceptors(authStore) {
  // Add a flag to track ongoing refresh operations
  let isRefreshing = false;
  let refreshPromise = null;

  api.interceptors.request.use(
    async (config) => {
      if (config.url?.includes("renew")) {
        return config;
      }

      if (authStore.isAuthenticated) {
        if (authStore.isTokenExpired()) {
          
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = authStore.refreshTokens()
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          }
          
          // Wait for the ongoing refresh to complete
          if (refreshPromise) {
            await refreshPromise;
          }
        }
        config.headers.Authorization = `Bearer ${authStore.tokens.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  adminApiBackend.interceptors.request.use(
    (config) => {
      const token = authStore.admin_api_token;
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
}

export { api, adminApi, adminApiBackend, mapsApi};
