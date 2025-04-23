<template>
  <Panel :header="getPanelHeader">
    <div class="flex flex-row gap-2 mb-2">
      <div class="flex flex-column flex-1">
        <Select
          class="w-full"
          v-model="program.okso"
          filter
          :options="selectOptions.directions"
          placeholder="Направление обучния"
          :class="{ 'p-invalid': showValidationErrors && oksoErrorMessage }"
          :disabled="!props.editable"
        />
        <Message
          v-if="showValidationErrors && oksoErrorMessage"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ oksoErrorMessage }}
        </Message>
      </div>

      <div class="flex flex-column flex-1">
        <InputText
          v-if="anotherUniversity"
          class="w-full"
          v-model="program.profile"
          placeholder="Профиль"
          :class="{ 'p-invalid': showValidationErrors && profileErrorMessage }"
          :readonly="!props.editable"
        />
        <Select
          v-else
          class="w-full"
          v-model="program.profile"
          :options="selectOptions.profiles"
          placeholder="Профиль"
          :class="{ 'p-invalid': showValidationErrors && profileErrorMessage }"
          :disabled="!props.editable"
        />
        <Message
          v-if="showValidationErrors && profileErrorMessage"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ profileErrorMessage }}
        </Message>
      </div>
    </div>

    <div class="mb-2">
      <div class="flex flex-row gap-2 align-items-center">
        <span class="mr-2">Основа обучния:</span>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="program.base"
            :inputId="`base-paid-${props.type}`"
            :name="`base-${props.type}`"
            value="Платная"
            :readonly="!props.editable"
          />
          <label :for="`base-paid-${props.type}`">Платная</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="program.base"
            :inputId="`base-free-${props.type}`"
            :name="`base-${props.type}`"
            :readonly="!props.editable"
            value="Бюджетная"
          />
          <label :for="`base-free-${props.type}`">Бюджетная</label>
        </div>
      </div>
      <Message
        v-if="showValidationErrors && baseErrorMessage"
        severity="error"
        variant="simple"
        size="small"
        class="ml-2"
      >
        {{ baseErrorMessage }}
      </Message>
    </div>

    <div class="mb-2">
      <div class="flex flex-row gap-2 align-items-center">
        <span class="mr-2">Форма обучния:</span>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="program.form"
            :inputId="`form-full-${props.type}`"
            :name="`form-${props.type}`"
            value="Очная"
            :readonly="!props.editable"
          />
          <label :for="`form-full-${props.type}`">Очная</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="program.form"
            :inputId="`form-evening-${props.type}`"
            :name="`form-${props.type}`"
            value="Очно-заочная"
            :readonly="!props.editable"
          />
          <label :for="`form-evening-${props.type}`">Очно-заочная</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="program.form"
            :inputId="`form-distant-${props.type}`"
            :name="`form-${props.type}`"
            value="Заочная"
            :readonly="!props.editable"
          />
          <label :for="`form-distant-${props.type}`">Заочная</label>
        </div>
      </div>
      <Message
        v-if="showValidationErrors && formErrorMessage"
        severity="error"
        variant="simple"
        size="small"
        class="ml-2"
      >
        {{ formErrorMessage }}
      </Message>
    </div>

    <div class="flex flex-column gap-3">
      <div class="flex flex-column">
        <InputText
          v-if="anotherUniversity"
          class="w-full"
          v-model="program.university"
          placeholder="Университет / Филлиал"
          :class="{
            'p-invalid': showValidationErrors && universityErrorMessage,
          }"
          :readonly="!props.editable"
        />
        <Select
          v-else
          class="w-full"
          v-model="program.university"
          :options="selectOptions.universities"
          placeholder="Университет / Филлиал"
          :class="{
            'p-invalid': showValidationErrors && universityErrorMessage,
          }"
          :disabled="!props.editable"
        />
        <Message
          v-if="showValidationErrors && universityErrorMessage"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ universityErrorMessage }}
        </Message>
      </div>

      <div class="flex flex-column">
        <Select
          class="w-min"
          v-model="program.sem_num"
          placeholder="Семестр"
          :options="selectOptions.semesters"
          optionLabel="title"
          optionValue="value"
          :class="{ 'p-invalid': showValidationErrors && semNumErrorMessage }"
          :disabled="!props.editable"
        />
        <Message
          v-if="showValidationErrors && semNumErrorMessage"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ semNumErrorMessage }}
        </Message>
      </div>
    </div>
  </Panel>
</template>

<script setup>
import { Select, InputText, RadioButton, Panel, Message } from "primevue";
import { defineModel, computed, onMounted, ref, watch } from "vue";

const program = defineModel("modelValue", {
  default: () => ({
    okso: "",
    profile: "",
    base: "",
    form: "",
    university: "",
    sem_num: null,
    type: "",
  }),
});

onMounted(() => {
  if (props.type && !program.value.type) {
    program.value.type = props.type;
  }
});

const props = defineProps({
  type: String,
  anotherUniversity: Boolean,
  selectOptions: {
    type: Object,
    default: () => ({
      directions: [
        "09.03.02 Информатика и информационные технологии",
        "10.03.01 Информационная безопасность",
      ],
      profiles: ["Profile 1", "Profile 2", "Profile 3", "Profile 4"],
      universities: ["Москва", "Не Москва"],
      semesters: [
        { title: "1 семестр", value: 1 },
        { title: "2 семестр", value: 2 },
        { title: "3 семестр", value: 3 },
        { title: "4 семестр", value: 4 },
        { title: "5 семестр", value: 5 },
        { title: "6 семестр", value: 6 },
        { title: "7 семестр", value: 7 },
        { title: "8 семестр", value: 8 },
        { title: "9 семестр", value: 9 },
        { title: "10 семестр", value: 10 },
      ],
    }),
  },
  showValidationErrors: {
    type: Boolean,
    default: false,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
  },
});

const emit = defineEmits(["update:isValid"]);

// Add the header based on type
const getPanelHeader = computed(() => {
  switch (props.type) {
    case "before":
      return "Ранее обучался";
    case "current":
      return "Текущая программа обучения";
    case "first":
      return "Желаемая программа обучения";
    case "second":
      return "Альтернативная программа обучения";
    default:
      return "";
  }
});

// Validation error messages
const oksoErrorMessage = computed(() => {
  if (!program.value.okso) {
    return "Выберите направление обучения";
  }
  return "";
});

const profileErrorMessage = computed(() => {
  if (!program.value.profile) {
    return "Укажите профиль обучения";
  }
  return "";
});

const baseErrorMessage = computed(() => {
  if (!program.value.base) {
    return "Выберите основу обучения";
  }
  return "";
});

const formErrorMessage = computed(() => {
  if (!program.value.form) {
    return "Выберите форму обучения";
  }
  return "";
});

const universityErrorMessage = computed(() => {
  if (!program.value.university) {
    return "Укажите университет";
  }
  return "";
});

const semNumErrorMessage = computed(() => {
  if (!program.value.sem_num) {
    return "Выберите семестр";
  }
  return "";
});

// Overall validation status
const isValid = computed(() => {
  return (
    !oksoErrorMessage.value &&
    !profileErrorMessage.value &&
    !baseErrorMessage.value &&
    !formErrorMessage.value &&
    !universityErrorMessage.value &&
    !semNumErrorMessage.value
  );
});

// Update parent component about validation status
watch(
  isValid,
  (valid) => {
    emit("update:isValid", valid);
  },
  { immediate: true },
);
</script>

<style scoped>
/* Add any necessary styling */
:deep(.p-message) {
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-message-wrapper) {
  padding: 0.25rem 0;
}
</style>
