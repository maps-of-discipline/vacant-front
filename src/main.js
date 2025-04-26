import { createApp } from 'vue';
import { createPinia } from 'pinia';

import "primeicons/primeicons.css"; // Иконки
import "primeflex/primeflex.css"; // Стили для верстки
import "./status-colors.css"

import PrimeVue from "primevue/config";
import router from "./router";
import App from "./App.vue";
import ThemePreset from "./Theme.js";
import ToastService from 'primevue/toastservice';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore.js';
import Tooltip from 'primevue/tooltip';

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
app.directive('tooltip', Tooltip);

const appStore = useAppStore();
appStore.init();

app.mount("#app");
