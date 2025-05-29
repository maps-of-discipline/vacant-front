import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'primeicons/primeicons.css'; // Иконки
import 'primeflex/primeflex.css'; // Стили для верстки
import './status-colors.css';

import PrimeVue from 'primevue/config';
import router from './router';
import App from './App.vue';
import ThemePreset from './Theme.js';
import ToastService from 'primevue/toastservice';
import { useAppStore } from './store/appStore.js';
import Tooltip from 'primevue/tooltip';
import { ConfirmationService } from 'primevue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: ThemePreset,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
});
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

const appStore = useAppStore();
appStore.init();

app.mount('#app');
