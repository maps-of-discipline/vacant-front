<template>
  <div v-if="authStore.checkPermissions(['canViewDashboard'])">
    <Dashboard />
  </div>
  <div
    v-else-if="authStore.checkPermissions(['canViewOwnApplications'])"
    class="content w-8 surface-0 m-auto p-3 flex flex-column border-round"
  >
    <SelfApplicationsTable />
  </div>
</template>

<script setup>
import SelfApplicationsTable from '../components/application/SelfApplicationsTable.vue';
import { useAuthStore } from '../store/authStore';
import Dashboard from './Dashboard.vue';

const authStore = useAuthStore();
</script>

<style scoped></style>
