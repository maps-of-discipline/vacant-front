import {defineStore} from "pinia";
import AuthService from "../services/authService.js";
import {jwtDecode} from "jwt-decode";


export const useAuthStore = defineStore("auth", {
    state: () => ({
        admin_api_token: localStorage.getItem("admin_api_token") || null,
        tokens: JSON.parse(localStorage.getItem("tokens")) || {
            access: null,
            refresh: null,
        },

        permissions: JSON.parse(localStorage.getItem("permissions")) || [],
        isAuthenticated: (localStorage.getItem("isAuthenticated") === "true")  || false,
    }),

    actions: {
        async authWithAdminApiToken(token) {

            this.admin_api_token = `Bearer ${token}`;
            localStorage.setItem('admin_api_token', token)

            this.tokens = await AuthService.authWithAdminApiToken(token);
            localStorage.setItem("tokens", JSON.stringify(this.tokens));

            this.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", JSON.stringify(this.isAuthenticated))

            const payload = jwtDecode(this.tokens.access);
            this.permissions = payload.permissions.map(perm => perm.title)
            localStorage.setItem("permissions", JSON.stringify(this.permissions));
        },

        isTokenExpired() {
            if (!this.tokens.access) return true;
            const payload = jwtDecode(this.tokens.access);
            return payload.exp <= Date.now() / 1000;
        },

        async refreshTokens() {
            this.tokens = await AuthService.refreshTokens(this.tokens);
            localStorage.setItem("tokens", JSON.stringify(this.tokens));
        },

        checkPermissions(required) {
            if (required.length === 0) {
                return this.isAuthenticated
            }
            return required.every(permission => this.permissions.includes(permission));
        },

        logout() {
            this.admin_api_token = null;
            this.tokens = { access: null, refresh: null };
            this.permissions = [];
            this.isAuthenticated = false;

            // Remove stored authentication data
            localStorage.removeItem("admin_api_token");
            localStorage.removeItem("tokens");
            localStorage.removeItem("permissions");
            localStorage.removeItem("isAuthenticated");

            window.location.href='/login';
        }
    },


});
