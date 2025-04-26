<template>
  <div>
    <Panel>
      <template #header>
        <div class="flex flex-row w-fit alighn-items-center gap-2">
          <span class="font-semibold">Управление</span>
          <Help :message="controlHelpMsg" />
        </div>
      </template>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <span class="font-semibold">Отображать:</span>
          <div class="flex justify-content-between">
            <div class="flex gap-2">
              <span>Совпадающие</span>
              <Checkbox :modelValue="model.showMatching" @update:modelValue="updateModel('showMatching', $event)" binary/>
            </div>
            <div class="flex gap-2">
              <span>С вариантами</span>
              <Checkbox :modelValue="model.showWithVariants" @update:modelValue="updateModel('showWithVariants', $event)" binary/>
            </div>
            <div class="flex gap-2">
              <span>Без вариантов</span>
              <Checkbox :modelValue="model.showWithoutVariants" @update:modelValue="updateModel('showWithoutVariants', $event)" binary/>
            </div>
          </div>
        </div>
        <div class="flex gap-2 align-items-center">
          <span class="font-semibold">Режим отображения:</span>
          <SelectButton class='m-auto' 
                       :modelValue="model.mode" 
                       @update:modelValue="updateModel('mode', $event)" 
                       :options="modeOptions" 
                       optionLabel='name' 
                       optionValue='value'/>
        </div>
        
        <div class="flex gap-2 align-items-center w-full">
          <span class="font-semibold w-full">Мин. схожесть: ({{ model.threshold }})</span>
          <Slider class="w-full" 
                 :modelValue="model.threshold" 
                 @update:modelValue="updateModel('threshold', $event)" 
                 :min="0.01" 
                 :max="1.00" 
                 :step="0.01"/>
        </div>
        <div class="flex gap-2 align-items-center">
          <span class="font-semibold">С понижением курса</span>
          <Checkbox :modelValue="model.withLowCourse" 
                   @update:modelValue="updateModel('withLowCourse', $event)" 
                   binary/>
        </div>  
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Checkbox, Panel, SelectButton, Slider } from "primevue";
import { computed, ref } from "vue";
import Help from "../UI/Help.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      mode: "rup",
      withLowCourse: false,
      threshold: 0.1,
      showMatching: true,
      showWithVariants: true,
      showWithoutVariants: true
    })
  }
});

const emit = defineEmits(['update:modelValue']);

// Create a computed property that works with v-model
const model = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
});

// Helper methods to update individual properties
const updateModel = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};

const modeOptions = [
  {
    name: "Откуда", 
    value: "source",
  },
  {
    name: "Рупы", 
    value: "rup",
  },
  {
    name: "Куда", 
    value: "target",
  },
];

const controlHelpMsg = ``;
</script>

<style scoped></style>
