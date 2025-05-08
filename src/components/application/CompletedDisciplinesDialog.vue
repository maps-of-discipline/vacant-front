<template>
  <div>
    <Panel>
      <template #header>
        <div class="flex flex-row w-fit align-items-center gap-2">
          <span class="font-semibold">Пройденные дисциплины</span>
          <Help
            :message="helpText"
            size="large"
          />
        </div>
      </template>

      <div class="flex w-full">
        <Button
          class="m-auto"
          label="Показать"
          @click="
            () => {
              isDialogShown = true;
            }
          "
        />
      </div>

      <Dialog
        v-model:visible="isDialogShown"
        class="w-6 min-w-min"
        modal
        header="Пройденные дисциплины"
      >
        <div class="text-sm">
          <div class="flex align-items-baseline gap-3">
            <span class="text-base">Ед. измерения оъема: </span>
            <SelectButton
              v-model="amountMeasure"
              class="mb-3"
              :allow-empty="false"
              :options="['ЗЕТ', 'Ак.Часы']"
              size="small"
            />
          </div>
          <ScrollPanel style="width: 100%; height: 500px">
            <DataTable
              size="small"
              :value="tableData"
              edit-mode="cell"
              :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                  bodycell: ({ state }) => ({
                    class: [{ 'p-0': state['d_editing'] }, 'pr-3'],
                  }),
                },
              }"
              @cell-edit-complete="onCellEditComplete"
            >
              <Column header="#">
                <template #body="slotProps">
                  <span>{{ slotProps.index + 1 }}</span>
                </template>
              </Column>
              <Column
                v-for="col of columns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :style="col.style"
              >
                <template #body="{ data, field }">
                  <Select
                    v-if="field == 'mark'"
                    v-model="data[field]"
                    :options="markOptions"
                    fluid
                  />
                  <span v-else-if="field == 'amount' && data[field]">
                    {{ data[field] }} {{ amountMeasure == 'ЗЕТ' ? ' з.е.' : ' ч.' }}</span
                  >
                  <span v-else-if="data[field]">{{ data[field] }}</span>
                  <span
                    v-else
                    class="text-400"
                    >-</span
                  >
                </template>
                <template
                  v-if="col.field == 'title' || col.field == 'amount'"
                  #editor="{ data, field }"
                >
                  <InputText
                    v-if="field == 'title'"
                    v-model="data[field]"
                    autofocus
                    fluid
                    placeholder="Название"
                  />
                  <InputNumber
                    v-else-if="field == 'amount'"
                    v-model="data[field]"
                    autofocus
                    fluid
                  />
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <div class="flex justify-content-end gap-2">
                    <Button
                      icon="pi pi-trash"
                      rounded
                      size="small"
                      severity="secondary"
                      @click="removeLine(slotProps.index)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </ScrollPanel>
          <div class="flex p-3 pb-0 jusify-content-center">
            <Button
              class="m-auto"
              icon="pi pi-plus"
              rounded
              @click="addBlankLine"
            />
          </div>
        </div>
      </Dialog>
    </Panel>
  </div>
</template>

<script setup>
import {
  Panel,
  InputText,
  InputNumber,
  Select,
  SelectButton,
  Button,
  DataTable,
  Column,
  Dialog,
  ScrollPanel,
} from 'primevue';
import { ref, watch } from 'vue';
import Help from '../UI/Help.vue';

const isDialogShown = ref(false);
const amountMeasure = ref('ЗЕТ');
const columns = ref([
  { header: 'Дисцпилина', field: 'title', style: 'width: 60%' },
  { header: 'Объем', field: 'amount', style: 'width: 20%' },
  { header: 'Оценка', field: 'mark', style: 'width: 20%' },
]);

const markOptions = ref(['Зачет', 'Удовлет.', 'Хорошо', 'Отлично']);
const tableData = ref([]);

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const default_ = [{ title: '', amount: '', mark: '' }];
tableData.value = props.modelValue ? props.modelValue.disciplines : default_;

const addBlankLine = () => {
  tableData.value.push({
    num: tableData.value.length + 1,
    title: '',
    amount: '',
    mark: '',
  });
};

watch(amountMeasure, (newValue) => {
  const coeff = newValue == 'ЗЕТ' ? 1 / 36 : 36;
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i]) tableData.value[i].amount *= coeff;
  }
});

watch(tableData.value, (value) => {
  const res = {
    measure: amountMeasure.value,
    disciplines: value,
  };
  emit('update:modelValue', res);
});

const removeLine = (id) => {
  tableData.value.splice(id, 1);
};

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  switch (field) {
    case 'mark':
      break;
    default:
      data[field] = newValue;
      break;
  }
};

const helpText = ref(
  `Здесь вы можете указать дисциплины, которые находяться в справке о периоде обучения. 
Заполнение необязательно, но значительно ускорит рассмотрение вашей заявки.

Инструкция:
 - Нажмите "Показать" для открытия формы
 - Выберите единицу измерения (ЗЕТ или академические часы)
 - Добавьте название дисциплины, объем и полученную оценку
 - Используйте "+" для добавления новых строк`
);
</script>

<style scoped></style>
