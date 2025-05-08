<template>
  <div class="flex h-screen align-items-center justify-content-center surface-50">
    <Panel
      class="login-form w-full md:w-5 lg:w-3 border-round-2xl shadow-4 flex flex-column p-0 montserrat-font mx-3 md:mx-0"
    >
      <template #header>
        <div class="text-center w-full pt-4 pb-3 flex flex-column align-items-center">
          <div class="mb-3">
            <img
              :src="'/logo-white.png'"
              alt="Московский Политех"
              height="70"
              class="mb-3"
              :class="{ 'logo-light-mode': !appStore.isDarkMode }"
            />
          </div>
          <h2 class="text-2xl font-bold m-0 text-900">Вход в систему</h2>
        </div>
      </template>

      <div class="px-4 py-5">
        <h4 class="text-lg text-600 text-center mb-5 mt-0 font-medium">
          Вход для студентов других ВУЗов
        </h4>

        <div class="flex flex-column gap-3 mb-2">
          <Button
            label="Войти"
            :loading="loading"
            class="p-3 font-medium text-base"
            icon="pi pi-sign-in"
            icon-pos="right"
            raised
            @click="AuthService.redirectToLoginViaEmail()"
          />

          <Button
            label="Регистрация"
            :loading="loading"
            severity="secondary"
            class="p-3 font-medium text-base"
            icon="pi pi-sign-in"
            icon-pos="right"
            @click="router.push({ name: 'Create User' })"
          />

          <div class="text-center mt-2">
            <router-link
              to="/login"
              class="text-primary font-medium text-md"
            >
              Назад
            </router-link>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from '../tools/toast.js';
import { Panel, Button } from 'primevue';
import AuthService from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const router = useRouter();
const toast = new Toast();
const authStore = useAuthStore();
const appStore = useAppStore();

const credentials = reactive({
  email: '',
});

const showValidation = ref(false);
const loading = ref(false);

const login = async () => {
  showValidation.value = true;

  if (!credentials.email) {
    return;
  }

  try {
    loading.value = true;
    await authStore.signInWithEmail(credentials.email);
    toast.success('Вы успешно вошли в систему');
    router.push({ name: 'SelfApplications' });
  } catch (error) {
    loading.value = false;
    toast.error(error.message || 'Неверные данные входа');
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 470px;
  min-width: 370px;
  margin: 0 auto;
}

.montserrat-font {
  font-family: 'Montserrat', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.logo-light-mode {
  filter: invert(1);
}
</style>
