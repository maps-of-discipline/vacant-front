<template>
    <div
      class="content application-panel flex flex-column gap-3 justify-content-center m-auto mb-4 montserrat-font"
    >
      <Panel
        header="Тип Заявления (временно)"
        class="flex flex-column border-2 border-red-100"
        :class="{
          'bg-red-100': !appStore.isDarkMode,
          'bg-red-900 opacity-50': appStore.isDarkMode,
        }"
      >
        <p>Пока не будет готово авто-определение типа заявления</p>
        <div class="m-auto w-fit">
          <SelectButton
            size="large"
            v-model="applicationType"
            :options="['change', 'reinstatement', 'transfer']"
          />
        </div>
      </Panel>
      <Panel class="">
        <template #header>
          <h3 v-if="applicationType === 'change'">
            Зявление на смену условий обучения
          </h3>
          <h3 v-else-if="applicationType === 'reinstatement'">
            Зявление на восстановление
          </h3>
          <h3 v-else-if="applicationType === 'transfer'">
            Зявление на перевод из другого ВУЗа
          </h3>
        </template>

        <div class="programs flex flex-column gap-4 mb-3">
          <ApplicationHeader
            :type="applicationType"
            v-model="formData.header"
            :showValidationErrors
            v-model:isValid="formValidation.header"
          />

          <Program
            v-for="(programConfig, index) in programConfigs"
            :key="`program-${index}`"
            v-model="formData.programs[index]"
            :type="programConfig.type"
            :anotherUniversity="programConfig.anotherUniversity"
            :showValidationErrors="showValidationErrors"
            v-model:isValid="formValidation.programs[index]"
          />

          <ApplicationFooter
            :showValidationErrors
            :type="applicationType"
            v-model="formData.footer"
            v-model:isValid="formValidation.footer"
          />
          <ApplicationFiles
            :type="applicationType"
            :isTransferToBudget="isChangeToBudget"
            v-model:isValid="formValidation.files"
            :showValidationErrors
          />
        </div>
        <div class="flex flex-column w-full align-items-center">
          <Button
           
            label="Подать заявление"
            icon="pi pi-check"
            @click="saveApplication"
          />
        </div>
      </Panel>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Panel, Button, SelectButton, useToast } from "primevue";
import { useRouter } from "vue-router";
import Program from "./Program.vue";
import ApplicationHeader from "./ApplicationHeader.vue";
import ApplicationFooter from "./ApplicationFooter.vue";
import ApplicationFiles from "./ApplicationFiles.vue";
import ApplicationService from "../../services/applicationService.js";
import { useAppStore } from "../../store/appStore.js";

const applicationType = ref("transfer");
const toast = useToast();
const router = useRouter();
const appStore = useAppStore();

const showValidationErrors = ref(false);

const formValidation = ref({
  header: false,
  programs: [false, false, false],
  footer: false,
  files: false,
});

const formData = ref({
  header: {},
  programs: [{}, {}, {}],
  footer: {},
});

// Dynamic program configurations based on application type
const programConfigs = computed(() => {
  const configs = [];

  // First program configuration
  if (applicationType.value === "reinstatement") {
    configs.push({ type: "before", anotherUniversity: false });
  } else if (applicationType.value === "change") {
    configs.push({ type: "current", anotherUniversity: false });
  } else if (applicationType.value === "transfer") {
    configs.push({ type: "current", anotherUniversity: true });
  }

  // Always add these two programs
  configs.push({ type: "first", anotherUniversity: false });
  configs.push({ type: "second", anotherUniversity: false });

  return configs;
});

const prepareFormData = (formData) => {
  if (formData.type === "reinstatement")
    return {
      ...formData,
      begin_year: formData.begin_year
        ? formData.begin_year.getFullYear()
        : formData.begin_year,
      end_year: formData.end_year
        ? formData.begin_year.getFullYear()
        : formData.end_year,
    };

  return formData;
};

const application = computed({
  get: () => {
    return {
      type: applicationType,
      date: new Date().toISOString(),
      ...prepareFormData(formData.value.header),
      ...formData.value.footer,
      programs: formData.value.programs,
    };
  },
});

const isChangeToBudget = computed({
  get: () => {
    if (applicationType !== "change") return false;
    const currentBase = formData.value.programs[0].base;
    const newBases = [
      formData.value.programs[1].base,
      formData.value.programs[2].base,
    ];
    return newBases.includes("Бюджетная") && currentBase !== "Бюджетная";
  },
});

const isFormValid = computed(() => {
  return (
    formValidation.value.header &&
    formValidation.value.programs.every((isValid) => isValid) &&
    formValidation.value.footer
  );
});

const saveApplication = async () => {
  
  showValidationErrors.value = true;

  if (!isFormValid.value) {
    toast.add({
      severity: "warn",
      summary: "Ошибка",
      detail: "Пожалуйста, заполните все необходимые поля",
      life: 3000,
    });
    return;
  } 

  try {
    const response = await ApplicationService.saveApplication(
      application.value,
    );
    toast.add({
      severity: "success",
      summary: "Успех",
      detail: "Заявление успешно сохранено",
      life: 3000,
    });
    await router.push({ name: "SelfApplications" });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "При сохранении заявления произошла ошибка",
      life: 3000,
    });
    // Handle the error, e.g., show an error message to the user
  }
};

watch(applicationType, (newValue) => {
  showValidationErrors.value = false;
  formValidation.value.header = false;
  formValidation.value.programs = [false, false, false];
  formValidation.value.footer = false;
});
</script>

<style scoped>
.application-panel {
  width: 100%;
  max-width: 800px;
  min-width: 530px;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .application-panel :deep(.p-panel-content) {
    padding: 0.5rem;
  }
}
</style>
