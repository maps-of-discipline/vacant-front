import {defineStore} from "pinia";
import {api} from "../services/api";
import AuthService from "../services/authService.js";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        admin_api_token: null,
        adminApiUserData: null,
        // {
        //     id: "6f493719-3446-4410-b3aa-1106af099c5f",
        //     external_id: "183183",
        //     role: "student",
        //     external_role: "stud",
        //     name: "Владислав",
        //     surname: "Бунаков",
        //     patronymic: "Евгеньевич",
        //     email: "vladb539@gmail.com",
        //     login: "v.e.bunakov",
        //     last_login: "2025-02-20T04:08:20.520909Z",
        //     created_at: "2025-02-20T04:08:20.520918Z"
        // },


        permissions: [],
        isAuthenticated: false,
    }),

    actions: {
        async setAdminApiToken(token) {
            this.admin_api_token = `Bearer ${token}`;
            await this.fetchUser(this.admin_api_token)
        },

        async fetchUser(token) {
            const userData = await AuthService.fetchUser(token);
            this.userData = userData;
            console.log(userData);
        },

        async login() {
            AuthService.redirectToLogin();
            this.isAuthenticated = true;
            await this.loadPermissions();
        },

        logout() {
            AuthService.logout();
            this.isAuthenticated = false;
            this.permissions = [];
        },

        async loadPermissions() {
            try {
                const response = await api.get("/user/permissions");
                this.permissions = response.data.permissions;
            } catch (error) {
                console.error("Failed to load permissions", error);
            }
        },

        hasPermission(permission) {
            return this.permissions.includes(permission);
        },
    },
});
