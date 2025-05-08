<template>
  <Panel class="panel-no-header">
    <div class="">
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox
          v-model="modelValue.hostel_policy_accepted"
          input-id="hostel_policy_accepted"
          binary
          :invalid="props.showValidationErrors && !props.modelValue.hostel_policy_accepted"
          :readonly="!props.editable"
        />
        <label for="hostel_policy_accepted">
          > Ознакомлен, что общежитие предоставляется при наличии свободного жилого фонда после
          заявки в личном кабинете обучающегося в соответствии с очередностью
        </label>
      </div>
      <div
        v-if="needsPaidPolicy"
        class="flex flex-row gap-2 mb-2"
      >
        <Checkbox
          v-model="modelValue.paid_policy_accepted"
          input-id="paid_policy_accepted"
          binary
          :invalid="props.showValidationErrors && !props.modelValue.paid_policy_accepted"
          :readonly="!props.editable"
        />
        <label for="paid_policy_accepted">
          > В случае невозможности перевода на бюджетную основу прошу рассмотреть возможность
          платную договорную основу
        </label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox
          v-model="modelValue.vacation_policy_viewed"
          input-id="vacation_policy_viewed"
          binary
          :invalid="props.showValidationErrors && !props.modelValue.vacation_policy_viewed"
          :readonly="!props.editable"
        />
        <label for="vacation_policy_viewed">
          С положением о заполнении вакантных мест ознакомлен
        </label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox
          v-model="modelValue.no_restrictions_policy_accepted"
          input-id="no_restrictions_policy_accepted"
          binary
          :invalid="props.showValidationErrors && !props.modelValue.no_restrictions_policy_accepted"
          :readonly="!props.editable"
        />
        <label for="no_restrictions_policy_accepted">
          > Подтверждаю отсутствие ограничений, предусмотренных для освоения образовательной
          программы за счет бюджетный оссигнований
        </label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox
          v-model="modelValue.reliable_information_policy_accepted"
          input-id="reliable_information_policy_accepted"
          binary
          :invalid="
            props.showValidationErrors && !props.modelValue.reliable_information_policy_accepted
          "
          :readonly="!props.editable"
        />
        <label for="reliable_information_policy_accepted">
          Ознакомлен с необходимостью в заявлении достовреный сведений и представления подлинных
          документов
        </label>
      </div>
      <Message
        v-if="!(!props.showValidationErrors || isValid)"
        severity="error"
        icon="pi pi-times-circle"
      >
        Пожалуйста, примите все условия
      </Message>
    </div>
  </Panel>
</template>

<script setup>
import { Panel, Checkbox, Message } from 'primevue';
import { computed, watch, onMounted } from 'vue';

const emit = defineEmits(['update:modelValue', 'update:isValid']);

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

const needsPaidPolicy = computed(() => props.type === 'reinstatement' || props.type === 'transfer');

const getDefaultObject = (type) => {
  const baseObject = {
    hostel_policy_accepted: false,
    vacation_policy_viewed: false,
    no_restrictions_policy_accepted: false,
    reliable_information_policy_accepted: false,
    type: type,
  };

  if (type === 'reinstatement' || type === 'change' || type === 'transfer') {
    baseObject.paid_policy_accepted = false;
  }

  return baseObject;
};

onMounted(() => {
  if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', getDefaultObject(props.type));
  } else if (props.modelValue.type !== props.type) {
    const newDefault = getDefaultObject(props.type);
    emit('update:modelValue', newDefault);
  }
});

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

const isValid = computed(() => {
  return (
    props.modelValue.hostel_policy_accepted &&
    props.modelValue.vacation_policy_viewed &&
    props.modelValue.no_restrictions_policy_accepted &&
    props.modelValue.reliable_information_policy_accepted &&
    (!needsPaidPolicy.value || props.modelValue.paid_policy_accepted)
  );
});

watch(
  isValid,
  (newValue) => {
    emit('update:isValid', newValue);
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
</style>
