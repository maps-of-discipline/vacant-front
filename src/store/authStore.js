import { defineStore } from 'pinia';
import AuthService from '../services/authService.js';
import { jwtDecode } from 'jwt-decode';
import { setLocalStorage, getLocalStorage } from './utils.js';
import { useApplicationsStore } from './applicationsStore.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth_data: getLocalStorage('auth_data') || {
      access: null,
      refresh: null,
    },

    user_data: getLocalStorage('user_data') || {},
    permissions: getLocalStorage('permissions') || [],
    isAuthenticated: getLocalStorage('isAuthenticated') || false,
  }),

  getters: {
    payload: (state) => {
      return jwtDecode(state.auth_data.access) || null;
    },
  },

  actions: {
    async setAuthData(access, refresh) {
      this.logout();
      this.auth_data = {
        access: access,
        refresh: refresh,
      };
      setLocalStorage('auth_data', this.auth_data);

      this.isAuthenticated = true;
      setLocalStorage('isAuthenticated', this.isAuthenticated);

      const payload = jwtDecode(this.auth_data.access);
      this.permissions = payload.permissions;
      setLocalStorage('permissions', this.permissions);
      this.user_data = await AuthService.fetchUserData();
      setLocalStorage('user_data', this.user_data);
    },

    async signUp(user) {
      this.logout();
      await AuthService.signUp(user);
    },

    setUserData(data) {
      this.auth_data = data;
      setLocalStorage('user_data', data);
    },

    async signInWithEmail(email) {
      this.logout();
      const auth_data = await AuthService.signInWithEmail(email);

      this.auth_data = auth_data;
      setLocalStorage('auth_data', this.auth_data);

      this.isAuthenticated = true;
      setLocalStorage('isAuthenticated', this.isAuthenticated);

      const payload = jwtDecode(this.auth_data.access);
      this.permissions = payload.permissions;
      setLocalStorage('permissions', this.permissions);
    },

    isTokenExpired() {
      if (!this.auth_data.access) return true;
      const payload = jwtDecode(this.auth_data.access);
      return new Date(payload.expires_at).getTime() <= Date.now();
    },

    checkPermissions(required) {
      if (required.length === 0) {
        return this.isAuthenticated;
      }
      return required.every((permission) => this.permissions.includes(permission));
    },

    logout() {
      this.admin_api_token = null;
      this.auth_data = { access: null, refresh: null };
      this.permissions = [];
      this.isAuthenticated = false;

      // Remove stored authentication data
      localStorage.removeItem('auth_data');
      localStorage.removeItem('permissions');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user_data');

      const applicationStore = useApplicationsStore();
      applicationStore.reset();
    },
  },
});
