import {createApp} from "vue";
import {createPinia} from "pinia";

import "primeicons/primeicons.css"; // Иконки
import "primeflex/primeflex.css"; // Стили для верстки

import PrimeVue from "primevue/config";
import router from "./router";
import App from "./App.vue";
import ThemePreset from "./Theme.js";

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
app.mount("#app");
