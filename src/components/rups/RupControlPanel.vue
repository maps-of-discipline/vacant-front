<template>
  <div>
    <Panel
      class="mb-4"
      :pt="{
        header: {
          class: ['p-2'],
        },
      }"
    >
      <div class="flex w-full gap-2">
        <Button
          label="Скачать документ"
          class="w-full"
        />
        <ElectiveModal
          v-model="model.choosenElectives"
          :rup-data="props.rupData"
        />
      </div>
    </Panel>

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
              <Checkbox
                :model-value="model.showMatching"
                binary
                @update:model-value="updateModel('showMatching', $event)"
              />
            </div>
            <div class="flex gap-2">
              <span>С вариантами</span>
              <Checkbox
                :model-value="model.showWithVariants"
                binary
                @update:model-value="updateModel('showWithVariants', $event)"
              />
            </div>
            <div class="flex gap-2">
              <span>Без вариантов</span>
              <Checkbox
                :model-value="model.showWithoutVariants"
                binary
                @update:model-value="updateModel('showWithoutVariants', $event)"
              />
            </div>
          </div>
        </div>
        <div class="flex gap-2 align-items-center">
          <span class="font-semibold">Режим отображения:</span>
          <SelectButton
            class="m-auto"
            :model-value="model.mode"
            :options="modeOptions"
            option-label="name"
            option-value="value"
            @update:model-value="updateModel('mode', $event)"
          />
        </div>

        <div class="flex gap-2 align-items-center w-full">
          <span class="font-semibold w-full">Мин. схожесть: ({{ model.threshold }})</span>
          <Slider
            class="w-full"
            :model-value="model.threshold"
            :min="0.01"
            :max="1.0"
            :step="0.01"
            @update:model-value="updateModel('threshold', $event)"
          />
        </div>
        <div class="flex gap-2 align-items-center">
          <span class="font-semibold">С понижением курса</span>
          <Checkbox
            :model-value="model.withLowCourse"
            binary
            @update:model-value="updateModel('withLowCourse', $event)"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { Checkbox, Panel, SelectButton, Slider, Button } from 'primevue';
import { computed } from 'vue';
import ElectiveModal from './ElectiveModal.vue';
import Help from '../UI/Help.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      mode: 'rup',
      withLowCourse: false,
      threshold: 0.1,
      showMatching: true,
      showWithVariants: true,
      showWithoutVariants: true,
      choosenElectives: {},
    }),
  },
  rupData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// Create a computed property that works with v-model
const model = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

// Helper methods to update individual properties
const updateModel = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};

const modeOptions = [
  {
    name: 'Откуда',
    value: 'source',
  },
  {
    name: 'Рупы',
    value: 'rup',
  },
  {
    name: 'Куда',
    value: 'target',
  },
];

const controlHelpMsg = ``;
</script>

<style scoped></style>
