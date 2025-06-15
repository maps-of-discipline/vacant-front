<template>
  <Panel :header="getPanelHeader">
    <div class="flex flex-column gap-2 mb-2">
      <div class="flex flex-column flex-1">
        <Select
          v-model="program.okso"
          class="w-full"
          filter
          :options="programOptions"
          option-label="title"
          option-value="value"
          :loading="props.isOptionsLoading"
          placeholder="Направление обучния"
          :class="{ 'p-invalid': showValidationErrors && oksoErrorMessage }"
          :show-clear="props.editable"
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
          v-model="program.profile"
          class="w-full"
          placeholder="Профиль"
          :class="{ 'p-invalid': showValidationErrors && profileErrorMessage }"
          :readonly="!props.editable"
        />
        <Select
          v-else
          v-model="program.profile"
          class="w-full"
          :options="filteredProfiles"
          option-label="title"
          option-value="aup"
          filter
          :loading="props.isOptionsLoading"
          placeholder="Профиль"
          :show-clear="props.editable"
          :class="{ 'p-invalid': showValidationErrors && profileErrorMessage }"
          :disabled="!props.editable"
          @update:model-value="onProfileUpdate"
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
    <div class="flex sm:flex-column gap-4 sm:gap-0">
      <div class="mb-2">
        <div class="flex flex-column sm:flex-row gap-2 align-items-left md:align-items-center">
          <span class="mr-2">Основа обучния:</span>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="program.base"
              :input-id="`base-paid-${props.type}`"
              :name="`base-${props.type}`"
              value="Платная"
              :readonly="!props.editable"
            />
            <label :for="`base-paid-${props.type}`">Платная</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="program.base"
              :input-id="`base-free-${props.type}`"
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
        <div class="flex flex-column sm:flex-row gap-2 align-items-left md:align-items-center">
          <span class="mr-2">Форма обучния:</span>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="program.form"
              :input-id="`form-full-${props.type}`"
              :name="`form-${props.type}`"
              value="Очная"
              :readonly="!props.editable"
            />
            <label :for="`form-full-${props.type}`">Очная</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="program.form"
              :input-id="`form-evening-${props.type}`"
              :name="`form-${props.type}`"
              value="Очно-заочная"
              :readonly="!props.editable"
            />
            <label :for="`form-evening-${props.type}`">Очно-заочная</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="program.form"
              :input-id="`form-distant-${props.type}`"
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
    </div>
    <div class="flex flex-column gap-3">
      <div class="flex flex-column">
        <Select
          v-if="anotherUniversity"
          v-model="program.university"
          class="w-full"
          filter
          editable
          :options="globalUniversityOptions"
          empty-message="Начните вводить название, чтобы увидеть список."
          empty-filter-message="Если в списке нет вашего университета, то введите название в поле."
          placeholder="Университет"
          :class="{
            'p-invalid': showValidationErrors && universityErrorMessage,
          }"
          :readonly="!props.editable"
          :pt="{
            label: {
              class: 'text-lg',
            },
          }"
          @filter="onUniverityFilter"
        />
        <Select
          v-else
          v-model="program.university"
          class="w-full"
          :options="selectOptions.cities"
          option-label="title"
          option-value="value"
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
          v-model="program.sem_num"
          class="w-min"
          placeholder="Семестр"
          :options="filteredSemesterOptions"
          option-label="title"
          option-value="value"
          :class="{ 'p-invalid': showValidationErrors && semNumErrorMessage }"
          :disabled="!props.editable || filteredSemesterOptions.length == 0"
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
import { Select, InputText, RadioButton, Panel, Message } from 'primevue';
import { defineModel, computed, onMounted, watch, ref } from 'vue';
import { debounce } from '../../../tools/utils';
import GetGeoService from '../../../services/getgeo';

const program = defineModel('modelValue', {
  default: () => ({
    okso: '',
    profile: '',
    base: '',
    form: '',
    university: '',
    sem_num: null,
    type: '',
  }),
});

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  anotherUniversity: Boolean,
  selectOptions: {
    type: Object,
    default: () => {},
  },
  isOptionsLoading: {
    type: Boolean,
    default: false,
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
  staffMode: {
    type: Boolean,
    default: false,
  },
});

const globalUniversityOptions = ref([]);

const emit = defineEmits(['update:isValid']);

// Add the header based on type
const getPanelHeader = computed(() => {
  const firstPriorityHeader = props.staffMode ? 'Приоритет 1' : 'Желаемая программа обучения';
  const secondPriorityHeader = props.staffMode
    ? 'Приоритет 2'
    : 'Альтернативная программа обучения';

  switch (props.type) {
    case 'before':
      return 'Ранее обучался';
    case 'current':
      return 'Текущая программа обучения';
    case 'first':
      return firstPriorityHeader;
    case 'second':
      return secondPriorityHeader;
    default:
      return '';
  }
});

const programOptions = computed(() => {
  const res = [];
  for (const [okso, program] of Object.entries(props.selectOptions.programs)) {
    res.push({
      title: `${okso} ${program.name}`,
      value: okso,
    });
  }
  return res;
});

const formTitleToId = (title) => {
  const mapper = {
    Очная: 1,
    'Очно-заочная': 2,
    Заочная: 3,
  };
  return mapper[title];
};

const filteredSemesterOptions = computed(() => {
  if (!program.value.profile) return [];

  let semCount = 12;
  for (const [, prog] of Object.entries(props.selectOptions.programs))
    for (const profile of prog.profiles)
      if (profile.aup === program.value.profile) semCount = profile.semCount;

  return props.selectOptions.semesters.filter((el) => el.value <= semCount);
});

const filteredProfiles = computed(() => {
  let profiles = [];
  for (const [okso, prog] of Object.entries(props.selectOptions.programs)) {
    if (program.value.okso && program.value.okso != okso) continue;

    for (const profile of prog.profiles) {
      if (profile.form_id !== formTitleToId(program.value.form)) continue;
      profiles.push(profile);
    }
  }
  return profiles;
});

const onProfileUpdate = (value) => {
  for (const [okso, programs] of Object.entries(props.selectOptions.programs)) {
    if (programs.profiles.some((el) => el.aup == value)) {
      program.value.okso = okso;
      return;
    }
  }
};

const onUniverityFilter = debounce(async (data) => {
  if (data.length == 0) return;

  const response = await GetGeoService.educations(data.value, 30);

  let options = response.suggestions.reduce((acc, el) => {
    const label = el.value;
    if (acc.indexOf(label) < 0) acc.push(label);
    return acc;
  }, []);

  globalUniversityOptions.value = options;
  console.log(globalUniversityOptions.value);
}, 1000);

// Validation error messages
const oksoErrorMessage = computed(() => {
  if (!program.value.okso) {
    return 'Выберите направление обучения';
  }
  return '';
});

const profileErrorMessage = computed(() => {
  if (!program.value.profile) {
    return 'Укажите профиль обучения';
  }
  return '';
});

const baseErrorMessage = computed(() => {
  if (!program.value.base) {
    return 'Выберите основу обучения';
  }
  return '';
});

const formErrorMessage = computed(() => {
  if (!program.value.form) {
    return 'Выберите форму обучения';
  }
  return '';
});

const universityErrorMessage = computed(() => {
  if (!program.value.university) {
    return 'Укажите университет';
  }
  return '';
});

const semNumErrorMessage = computed(() => {
  if (!program.value.sem_num) {
    return 'Выберите семестр';
  }
  return '';
});

// Overall validation status
const isFormValid = computed(() => {
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
  isFormValid,
  (valid) => {
    emit('update:isValid', valid);
  },
  { immediate: true }
);

onMounted(() => {
  if (props.type && !program.value.type) {
    program.value.type = props.type;
  }
  program.value.form = 'Очная';
  program.value.university = 'Москва';
});
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
