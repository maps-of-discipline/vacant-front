<template>
  <div class="flex w-full">
    <div class="flex w-full">
      <Button
        label="Выбор элективов"
        class="flex w-full"
        @click="() => (isVisible = true)"
      />
    </div>
    <Dialog
      v-model:visible="isVisible"
      class="w-8"
      modal
      header="Выбор элективных дисциплин"
    >
      <Tabs :value="0">
        <TabList>
          <Tab
            v-for="(_, group, index) in tableData"
            :key="index"
            :value="index"
          >
            <span class="text-base">{{ group == 'source' ? 'Текущий УП' : 'Желаемый УП' }}</span>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            v-for="(items, group, index) in tableData"
            :key="index"
            :value="index"
          >
            <DataTable
              :value="items"
              row-group-mode="subheader"
              group-rows-by="group_title"
            >
              <Column>
                <template #body="{ data }">
                  <div class="flex gap-3">
                    <Checkbox
                      v-model="choosenElectives[group][data.elective_group]"
                      :value="data.title"
                      :disabled="isCheckBoxInactive(group, data)"
                    />
                    <span>{{ data.title }}</span>
                  </div>
                </template>
              </Column>
              <template #groupheader="{ data }">
                <span class="text-lg font-semibold">{{ data.group_title }}</span>
              </template>
            </DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, reactive, onMounted } from 'vue';
import {
  Dialog,
  DataTable,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Column,
  Button,
  Checkbox,
} from 'primevue';

const isVisible = ref(false);
const tableData = ref({
  source: [],
  target: [],
});

const choosenElectives = reactive({
  source: {},
  target: {},
});

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return { source: {}, target: {} };
    },
  },
  rupData: {
    type: Object,
    required: true,
  },
});

watch(props.rupData, (data) => {
  for (const el of [...data.same, ...data.source]) {
    if (el.elective_group)
      tableData.value.source.push({
        ...el,
        type: 'source',
        group_title: `Элективные дисциплины #${el.elective_group}`,
      });
  }

  for (const el of [...data.same, ...data.target]) {
    if (el.elective_group)
      tableData.value.target.push({
        ...el,
        type: 'target',
        group_title: `Элективные дисциплины #${el.elective_group}`,
      });
  }
  tableData.value.source = tableData.value.source.sort(
    (a, b) => a.elective_group >= b.elective_group
  );

  tableData.value.target = tableData.value.target.sort(
    (a, b) => a.elective_group >= b.elective_group
  );
});

onMounted(() => {
  const res = {
    source: {},
    target: {},
  };
  for (const [k, v] of Object.entries(props.modelValue)) {
    for (const [group, choosed] of v) res[k][group] = [choosed];
  }
  Object.assign(choosenElectives, res);
});

watch(choosenElectives, (n) => {
  const res = {
    source: {},
    target: {},
  };

  for (const [k, v] of Object.entries(n)) {
    for (const [group, choosed] of Object.entries(v)) res[k][group] = choosed[0];
  }
  emit('update:modelValue', res);
});

const isCheckBoxInactive = (group, data) => {
  return (
    choosenElectives[group][data.elective_group]?.length > 0 &&
    choosenElectives[group][data.elective_group][0] !== data.title
  );
};
</script>

<style scoped></style>
