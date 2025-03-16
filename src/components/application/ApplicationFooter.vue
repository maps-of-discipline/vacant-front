<template>
  <Panel class="panel-no-header"> 
    <div class="">
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox inputId='hostel_policy_accepted' v-model="modelValue.hostel_policy_accepted" binary />
        <label for="hostel_policy_accepted">Ознакомлен, что общежитие предоставляется при наличии свободного жилого фонда после
          подачи заявки в личном кабинете обучающегося в соответствии с очередностью</label>
      </div>
      <div class="flex flex-row gap-2 mb-2" v-if="needsPaidPolicy">
        <Checkbox inputId='paid_policy_accepted' v-model="modelValue.paid_policy_accepted" binary />
        <label for="paid_policy_accepted">В случае невозможности перевода на бюджетную основу прошу рассмотреть возможность
          перевода на платную договорную основу</label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox inputId='vacation_policy_viewed' v-model="modelValue.vacation_policy_viewed" binary />
        <label for="vacation_policy_viewed">С положением о заполнении вакантных мест ознакомлен</label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox inputId='no_restrictions_policy_accepted' v-model="modelValue.no_restrictions_policy_accepted" binary />
        <label for="no_restrictions_policy_accepted">Подтверждаю отсутствие ограничений, предусмотренных для освоения образовательной
          программы за счет бюджетный оссигнований</label>
      </div>
      <div class="flex flex-row gap-2 mb-2">
        <Checkbox inputId='reliable_information_policy_accepted' v-model="modelValue.reliable_information_policy_accepted" binary />
        <label for="reliable_information_policy_accepted"> Ознакомлен с необходимостью в заявлении достовреный сведений и представления подлинных
          документов</label>
      </div>
    </div>
  </Panel>
</template>

<script>
// Define the props outside of setup
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['reinstatement', 'change', 'transfer'].includes(value)
    },
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue']
}
</script>

<script setup>
import { Panel, Checkbox } from "primevue";
import { computed, watch, onMounted } from "vue";

const props = defineProps(['type', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

// Determine if paid policy checkbox should be shown
const needsPaidPolicy = computed(() => 
  props.type === 'reinstatement' || props.type === 'change'
);

// Create default objects based on the type
const getDefaultObject = (type) => {
  const baseObject = {
    hostel_policy_accepted: false,
    vacation_policy_viewed: false,
    no_restrictions_policy_accepted: false,
    reliable_information_policy_accepted: false,
    type: type
  };

  // Add type-specific properties
  if (type === 'reinstatement' || type === 'change') {
    baseObject.paid_policy_accepted = false;
  }

  return baseObject;
};

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
watch(() => props.type, (newType) => {
  const currentData = props.modelValue || {};
  const newDefault = getDefaultObject(newType);
  
  // Reset model with new structure while keeping any matching properties
  emit('update:modelValue', { 
    ...newDefault,
    ...Object.keys(currentData)
      .filter(key => Object.keys(newDefault).includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: currentData[key] }), {})
  });
}, { immediate: true });
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