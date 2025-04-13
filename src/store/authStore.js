import { defineStore } from "pinia";
import AuthService from "../services/authService.js";
import { jwtDecode } from "jwt-decode";
import { setLocalStorage } from './utils.js'

export const useAuthStore = defineStore("auth", {
    state: () => ({
        auth_data: JSON.parse(localStorage.getItem("auth_data")) || {
            access: null,
            refresh: null,
        },

        permissions: JSON.parse(localStorage.getItem("permissions")) || [],
        isAuthenticated: (localStorage.getItem("isAuthenticated") === "true") || false,
    }),

    actions: {
        async setAuthData(access, refresh) {
            this.logout();
            this.auth_data = {
                access: access,
                refresh: refresh
            }
            console.log("setting auth data. this.auth_data = ", this.auth_data)
            setLocalStorage('auth_data', this.auth_data);

            this.isAuthenticated = true;
            setLocalStorage('isAuthenticated', this.isAuthenticated)

            const payload = jwtDecode(this.auth_data.access);
            this.permissions = payload.permissions
            setLocalStorage("permissions", this.permissions)
        },

        async signUp(user) {
            this.logout()
            await AuthService.signUp(user)
        },

        async signInWithEmail(email) {
            this.logout();
            const auth_data = await AuthService.signInWithEmail(email);

            this.auth_data = auth_data;
            setLocalStorage('auth_data', this.auth_data)

            this.isAuthenticated = true;
            setLocalStorage('isAuthenticated', this.isAuthenticated)

            const payload = jwtDecode(this.auth_data.access);
            this.permissions = payload.permissions
            setLocalStorage("permissions", this.permissions)
        },

        isTokenExpired() {
            if (!this.auth_data.access) return true;
            const payload = jwtDecode(this.auth_data.access);
            return new Date(payload.expires_at).getTime() <= Date.now();
        },

        checkPermissions(required) {
            if (required.length === 0) {
                return this.isAuthenticated
            }
            return required.every(permission => this.permissions.includes(permission));
        },

        logout() {
            this.admin_api_token = null;
            this.auth_data = { access: null, refresh: null };
            this.permissions = [];
            this.isAuthenticated = false;

            // Remove stored authentication data
            localStorage.removeItem("auth_data");
            localStorage.removeItem("permissions");
            localStorage.removeItem("isAuthenticated");
        }
    },
});
