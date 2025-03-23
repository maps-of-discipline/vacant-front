<script setup>
import { ref, computed } from "vue";
import { Menubar, Image, Button } from "primevue";
import { useAuthStore } from "../store/authStore.js";
import ToggleSwitch from "primevue/toggleswitch";
import { useRouter } from "vue-router";
import { useAppStore } from "../store/appStore.js";

const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();

const items = ref([
  {
    label: "Список поданных заявлений",
    command: () => {
      router.push("/applications");
    },
  },
  {
    label: "Профиль",
  },
  {
    label: "РУПЫ",
    command: () => {
      router.push({name: "Rups"})
    }
  },
]);

// Use a computed property with getter and setter to bind to the store
const isDarkMode = computed({
  get: () => appStore.isDarkMode,
  set: (value) => appStore.toggleDarkMode(value)
});

</script>

<template>
  <div
    class="flex flex-row justify-content-start gap-4 align-items-center w-12 p-3 mb-4 shadow-2 surface-0 montserrat-font"
    v-if="authStore.isAuthenticated"
  >
    <Image
      width="192"
      src="/logo-white.png"
      alt="logo"
      :class="{ 'logo-light-mode': !isDarkMode }"
      @click="router.push('/')"
    />
    <Menubar :model="items" class="surface-0 border-0" />

    <!-- Надпись и ToggleSwitch -->
    <div class="flex align-items-center ml-auto">
      <span class="mr-2">Темная тема</span>
      <ToggleSwitch
        v-model="isDarkMode"
        class="mr-3"
        :onLabel="'🌙'"
        :offLabel="'☀️'"
      />
      <Button 
        icon="pi pi-sign-out" 
        size="small" 
        rounded 
        aria-label="Filter" 
        @click="authStore.logout()"  
      />
    </div>
  </div>
</template>

<style scoped>
.logo-light-mode {
  filter: invert(1);
}
</style>
