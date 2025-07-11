<template>
  <Panel
    v-if="type === 'reinstatement'"
    class="panel-no-header"
  >
    <div class="flex flex-column gap-2 mb-4">
      <label class="mb-2">Цель восстановления: </label>
      <div class="flex flex-row gap-2 align-items-center">
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="modelValue.purpose"
            input-id="10"
            name="purpose"
            value="continue_study"
            :readonly="!props.editable"
          />
          <label for="male">Продолжение обучения</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="modelValue.purpose"
            input-id="20"
            name="purpose"
            value="gia"
            :readonly="!props.editable"
          />
          <label for="male">Подготовка и прохождение ГИА</label>
        </div>
      </div>
    </div>

    <div class="flex flex-row gap-2 mb-3">
      <Checkbox
        v-model="modelValue.is_vacation_need"
        binary
        :readonly="!props.editable"
      />
      <label for="male"
        >Предоставление каникул в пределах срока освоения образовательной программы</label
      >
    </div>

    <div class="flex flex-column gap-2 mb-2">
      <div class="flex flex-row gap-2">
        <div class="flex flex-column flex-1">
          <DatePicker
            v-model="modelValue.begin_year"
            class="w-full"
            view="year"
            date-format="yy"
            placeholder="Год поступления"
            :readonly="!props.editable"
            :class="{ 'p-invalid': showValidationErrors && beginYearErrorMessage }"
          />
          <Message
            v-if="showValidationErrors && beginYearErrorMessage"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ beginYearErrorMessage }}
          </Message>
        </div>

        <div class="flex flex-column flex-1">
          <DatePicker
            v-model="modelValue.end_year"
            class="w-full"
            view="year"
            date-format="yy"
            placeholder="Год отчисления"
            :readonly="!props.editable"
            :class="{ 'p-invalid': showValidationErrors && endYearErrorMessage }"
          />
          <Message
            v-if="showValidationErrors && endYearErrorMessage"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ endYearErrorMessage }}
          </Message>
        </div>

        <div class="flex flex-column flex-1">
          <InputText
            v-model="modelValue.group"
            placeholder="Учебная группа (например: 12-34)"
            :class="{ 'p-invalid': showValidationErrors && groupErrorMessage }"
            :disabled="!props.editable"
          />
          <Message
            v-if="showValidationErrors && groupErrorMessage"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ groupErrorMessage }}
          </Message>
        </div>
      </div>
    </div>
  </Panel>

  <Panel
    v-if="type === 'change'"
    header="Прошу изменить мне условия обучения в связи с: "
  >
    <div class="flex flex-column">
      <div
        v-for="(item, index) in changePuposeVariants"
        :key="index"
        class="flex align-items-center mb-3"
      >
        <RadioButton
          v-if="props.editable"
          v-model="modelValue.purpose"
          :value="item"
          class="m-2"
        />
        <span v-if="props.editable">{{ item }}</span>
      </div>
      <Textarea
        id="purpose"
        v-model="modelValue.purpose"
        auto-resize
        class="w-full"
        rows="3"
        placeholder="Другое"
        :class="{ 'p-invalid': showValidationErrors && purposeErrorMessage }"
        :disabled="!props.editable"
      />
      <Message
        v-if="showValidationErrors && purposeErrorMessage"
        severity="error"
        variant="simple"
        size="small"
      >
        {{ purposeErrorMessage }}
      </Message>
    </div>
  </Panel>

  <Panel
    v-if="type === 'transfer'"
    header="Для аспирантов: "
  >
    <div class="flex flex-column">
      <div class="flex flex-row gap-3 align-items-center">
        <label>Номер курса для продолжения обучения: </label>
        <Select
          v-model="modelValue.continue_year"
          class="w-min"
          :options="courseOptions"
          placeholder="Курс"
          option-label="title"
          option-value="value"
          show-clear
        />
      </div>
    </div>
  </Panel>
</template>

<script setup>
import {
  DatePicker,
  Checkbox,
  InputText,
  RadioButton,
  Panel,
  Textarea,
  Select,
  Message,
} from 'primevue';
import { watch, onMounted, computed } from 'vue';

const changePuposeVariants = ['личным желанием'];

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['reinstatement', 'change', 'transfer'].includes(value),
  },
  modelValue: {
    type: Object,
    required: true,
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
const emit = defineEmits(['update:modelValue', 'update:isValid']);

// Regex pattern for study group validation - two numbers separated by a hyphen
const studyGroupPattern = /^\d+-\d+$/;
const currentYear = new Date().getFullYear();

const getDefaultObject = (type) => {
  switch (type) {
    case 'reinstatement':
      return {
        is_vacation_need: false,
        begin_year: null,
        end_year: null,
        group: '',
        purpose: 'continue_study',
        type: 'reinstatement',
      };
    case 'change':
      return {
        purpose: '',
        type: 'change',
      };
    case 'transfer':
      return {
        continue_year: null,
        type: 'transfer',
      };
    default:
      return {};
  }
};

const courseOptions = [
  { title: '1 курс', value: 1 },
  { title: '2 курс', value: 2 },
];

// Initialize model when component mounts
onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', getDefaultObject(props.type));
  } else if (props.modelValue.type !== props.type) {
    const newDefault = getDefaultObject(props.type);
    emit('update:modelValue', newDefault);
  }
});

// Update model value if type changes
watch(
  () => props.type,
  (newType) => {
    const currentData = props.modelValue || {};
    const newDefault = getDefaultObject(newType);

    // Reset model with new structure while keeping any matching properties
    emit('update:modelValue', {
      ...newDefault,
      ...Object.keys(currentData)
        .filter((key) => Object.keys(newDefault).includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: currentData[key] }), {}),
    });
  },
  { immediate: true }
);

// Validation messages - empty string means valid
const beginYearErrorMessage = computed(() => {
  if (!props.modelValue.begin_year) {
    return 'Укажите год поступления';
  }

  const year =
    props.modelValue.begin_year instanceof Date
      ? props.modelValue.begin_year.getFullYear()
      : new Date(props.modelValue.begin_year).getFullYear();

  if (isNaN(year)) {
    return 'Неверный формат года';
  } else if (year < 1900) {
    return 'Год должен быть не ранее 1900';
  } else if (year > currentYear) {
    return 'Год не может быть позже текущего года';
  }

  return ''; // Valid
});

const endYearErrorMessage = computed(() => {
  if (!props.modelValue.end_year) {
    return 'Укажите год отчисления';
  }

  const endYear =
    props.modelValue.end_year instanceof Date
      ? props.modelValue.end_year.getFullYear()
      : new Date(props.modelValue.end_year).getFullYear();

  if (isNaN(endYear)) {
    return 'Неверный формат года';
  } else if (endYear < 1900) {
    return 'Год должен быть не ранее 1900';
  } else if (endYear > currentYear) {
    return 'Год не может быть позже текущего года';
  }

  // Check begin year relation if applicable
  if (!beginYearErrorMessage.value) {
    const beginYear =
      props.modelValue.begin_year instanceof Date
        ? props.modelValue.begin_year.getFullYear()
        : new Date(props.modelValue.begin_year).getFullYear();

    if (endYear < beginYear) {
      return 'Год отчисления должен быть не ранее года поступления';
    }
    if (endYear - beginYear > 5) {
      return 'Разница между годами не должна превышать 5 лет';
    }
  }

  return ''; // Valid
});

const groupErrorMessage = computed(() => {
  if (!props.modelValue.group) {
    return 'Укажите номер группы';
  }

  if (!studyGroupPattern.test(props.modelValue.group)) {
    return 'Неверный формат группы';
  }

  return ''; // Valid
});

const purposeErrorMessage = computed(() => {
  if (!props.modelValue.purpose || props.modelValue.purpose.trim().length === 0) {
    return 'Поле не должно быть пустым';
  }
  return ''; // Valid
});

// Overall validation based on error messages
const isValid = computed(() => {
  switch (props.type) {
    case 'reinstatement':
      return !beginYearErrorMessage.value && !endYearErrorMessage.value && !groupErrorMessage.value;
    case 'change':
      return !purposeErrorMessage.value;
    case 'transfer':
      return true;
    default:
      return false;
  }
});

// Emit validation status when it changes
watch(
  isValid,
  (valid) => {
    emit('update:isValid', valid);
  },
  { immediate: true }
);
</script>

<style scoped>
.panel-no-header :deep(.p-panel-header) {
  padding: 0;
  padding-bottom: 18px;
  height: 0;
  min-height: 0;
  border: none;
}

:deep(.p-message) {
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-message-wrapper) {
  padding: 0.25rem 0;
}
</style>
