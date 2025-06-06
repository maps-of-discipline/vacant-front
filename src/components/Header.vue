<template>
  <div
    v-if="authStore.isAuthenticated"
    class="flex flex-row header-container justify-content-start gap-4 align-items-center w-12 p-3 mb-4 shadow-2 surface-0 montserrat-font"
  >
    <Menubar
      class="flex-grow-1 border-0"
      breakpoint="1192px"
      :model="accessableItems"
    >
      <template #start>
        <Image
          width="192"
          src="/logo-white.png"
          alt="logo"
          class="cursor-pointer"
          :class="{ 'logo-light-mode': !isDarkMode }"
          @click="router.push('/')"
        />
      </template>
      <template #end>
        <div class="md:flex hidden align-items-center ml-auto">
          <span class="mr-2">Темная тема</span>
          <ToggleSwitch
            v-model="isDarkMode"
            class="mr-3"
            :on-label="'🌙'"
            :off-label="'☀️'"
          />
          <Button
            v-if="authStore.checkPermissions(['canUpdateTokens'])"
            icon="pi pi-sync"
            size="small"
            class="mr-2"
            rounded
            aria-label="Filter"
            @click="onTokenRefresh()"
          />
          <Button
            icon="pi pi-sign-out"
            size="small"
            class="mr-2"
            rounded
            aria-label="Filter"
            @click="onLogout()"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Menubar, Image, Button } from 'primevue';
import { useAuthStore } from '../store/authStore.js';
import ToggleSwitch from 'primevue/toggleswitch';
import AuthService from '../services/authService.js';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store/appStore.js';

const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();

const items = ref([
  {
    label: 'Список поданных заявлений',
    icon: 'pi pi-file',
    command: () => {
      router.push({ name: 'SelfApplications' });
    },
    require: ['canViewOwnApplications'],
  },
  {
    label: 'Профиль',
    icon: 'pi pi-user',
    command: () => {
      router.push({ name: 'Profile' });
    },
    require: [],
  },
  {
    label: 'Список заявлений',
    icon: 'pi pi-list',
    command: () => {
      router.push({ name: 'Applications' });
    },
    require: ['canViewApplicationsList'],
  },
]);

const accessableItems = computed(() => {
  return items.value.filter((el) => authStore.checkPermissions(el.require));
});

// Use a computed property with getter and setter to bind to the store
const isDarkMode = computed({
  get: () => appStore.isDarkMode,
  set: (value) => appStore.toggleDarkMode(value),
});

const onLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};

const onTokenRefresh = async () => {
  const auth_data = await AuthService.refreshTokens(
    authStore.auth_data.access,
    authStore.auth_data.refresh
  );
  authStore.setAuthData(auth_data.access, auth_data.refresh);
};
</script>

<style scoped>
.logo-light-mode {
  filter: invert(1);
}

.header-container {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
