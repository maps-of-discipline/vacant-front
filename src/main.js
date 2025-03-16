import { createApp } from 'vue';
import { createPinia } from 'pinia';

import "primeicons/primeicons.css"; // Иконки
import "primeflex/primeflex.css"; // Стили для верстки

import PrimeVue from "primevue/config";
import router from "./router";
import App from "./App.vue";
import ThemePreset from "./Theme.js";
import ToastService from 'primevue/toastservice';
import { setupInterceptors } from './services/api';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: ThemePreset,
    options: {
      darkModeSelector: ".my-app-dark"
    }
  },
});
app.use(router);
app.use(ToastService);

// After pinia is installed, set up the interceptors with the auth store
const authStore = useAuthStore();
setupInterceptors(authStore);

const appStore = useAppStore();
appStore.init();

app.mount("#app");
