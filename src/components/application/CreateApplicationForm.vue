<template>
  <div class="content application-panel flex flex-column gap-3 justify-content-center m-auto mb-4 montserrat-font">
    <Panel>
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
        <ApplicationHeader :type="applicationType" v-model="formData.header" :showValidationErrors
          v-model:isValid="formValidation.header" />

        <Program v-for="(programConfig, index) in programConfigs" :key="`program-${index}`"
          v-model="formData.programs[index]" :type="programConfig.type"
          :anotherUniversity="programConfig.anotherUniversity" :showValidationErrors="showValidationErrors"
          v-model:isValid="formValidation.programs[index]" />

        <ApplicationFooter :showValidationErrors :type="applicationType" v-model="formData.footer"
          v-model:isValid="formValidation.footer" />
        <ApplicationFiles :type="applicationType" :isTransferToBudget="isChangeToBudget"
          v-model:isValid="formValidation.files" :showValidationErrors />
      </div>
      <div class="flex flex-column w-full align-items-center">
        <Button label="Подать заявление" icon="pi pi-check" @click="onSubmit" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount, defineEmits, isVNode } from "vue";
import { Panel, Button, useToast } from "primevue";
import { useRouter } from "vue-router";
import Program from "./Program.vue";
import ApplicationHeader from "./ApplicationHeader.vue";
import ApplicationFooter from "./ApplicationFooter.vue";
import ApplicationFiles from "./ApplicationFiles.vue";
import ApplicationService from "../../services/applicationService.js";

const applicationType = computed(() => {
  return model.value.type;
});

const toast = useToast();
const router = useRouter();


const showValidationErrors = ref(false);
const emit = defineEmits(['valid-submit'])

const model = defineModel({
  type: Object,
  required: true,
  default: () => ({ type: "change" }),
})

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

watch(application, (newValue) => {
  model.value = { ...newValue, type: applicationType }
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

const onSubmit = () => {
  showValidationErrors.value = true;
  console.log(application.value)
  if (isFormValid.value) {
    emit('valid-submit', application.value)
  }
  else {
  
    toast.add({
      severity: "warn",
      summary: "Ошибка",
      detail: "Пожалуйста, заполните все необходимые поля",
      life: 3000,
    });}
};


watch(applicationType, (newValue) => {
  showValidationErrors.value = false;
  formValidation.value.header = false;
  formValidation.value.programs = [false, false, false];
  formValidation.value.footer = false;

  formData.value = {
    header: {type: newValue},
    programs: [{}, {}, {}],
    footer: {type: newValue},
  }

});


const initializeFormData = () => {
  const newFormData = {
    header: { type: applicationType.value },
    programs: [{}, {}, {}],
    footer: { type: applicationType.value },
  };

  // If we have an existing application, parse its data into the form sections
  if (Object.keys(model.value).length > 1) {
    // Extract header fields based on application type
    const headerFields = getHeaderFields(applicationType.value);
    headerFields.forEach(field => {
      if (model.value[field] !== undefined) {
        newFormData.header[field] = model.value[field];
      }
    });

    // Extract programs if they exist
    if (model.value.programs && Array.isArray(model.value.programs)) {
      model.value.programs.forEach((program, index) => {
        if (index < 3) {
          newFormData.programs[index] = { ...program };
        }
      });
    }

    // Extract footer fields
    const footerFields = getFooterFields();
    footerFields.forEach(field => {
      if (model.value[field] !== undefined) {
        newFormData.footer[field] = model.value[field];
      }
    });
  }

  formData.value = newFormData;
};

// Define which fields belong to which section based on application type
const getHeaderFields = (type) => {
  const commonFields = ['type'];

  if (type === 'reinstatement') {
    return [...commonFields, 'is_vacation_need', 'begin_year', 'end_year', 'group', 'purpose'];
  } else if (type === 'change') {
    return [...commonFields, 'purpose'];
  } else if (type === 'transfer') {
    return [...commonFields, 'continue_year'];
  }

};

const getFooterFields = () => {
  return [
    'hostel_policy_accepted',
    'paid_policy_accepted',
    'vacation_policy_viewed',
    'no_restrictions_policy_accepted',
    'reliable_information_policy_accepted'
  ];
};

onBeforeMount(() => {
  initializeFormData()
});

</script>

<style scoped>
@media screen and (max-width: 768px) {
  .application-panel :deep(.p-panel-content) {
    padding: 0.5rem;
  }
}
</style>
