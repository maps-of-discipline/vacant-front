<template>
  <div class="page m-auto mt-3">
    <Panel header="Тип Заявления (временно)" class="flex flex-column border-2 border-red-100" :class="{
      'bg-red-100': !appStore.isDarkMode,
      'bg-red-900 opacity-50': appStore.isDarkMode,
    }">
      <p>Пока не будет готово авто-определение типа заявления</p>
      <div class="m-auto w-fit">
        <SelectButton size="large" v-model="applicationType" :options="['change', 'reinstatement', 'transfer']" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Panel, SelectButton } from "primevue";
import { useAppStore } from "../store/appStore";
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import { useApplicationsStore } from "../store/applicationsStore";

const appStore = useAppStore();
const applicationsStore = useApplicationsStore();

const applicationType = ref("");

watch(applicationType, (new_, old) => {
  applicationsStore.setType(new_);
});

onMounted(() => {
  console.log(applicationType.value);
  applicationType.value = applicationsStore.applicationType;
  console.log(applicationType.value);
});
</script>

<style scoped>
.page {
  max-width: 600px;
  min-width: 300px;
  width: 100%;
  margin: 0 auto;
}
</style>
