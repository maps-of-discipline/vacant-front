<template>
  <div class="flex flex-row w-11 m-auto gap-4">
    <Panel class="w-full">
      <template #header>
        <div class="flex flex-row w-fit alighn-items-center gap-2">
          <span class="font-semibold">Учебный план</span>
          <Help :message="studyHelpMessage" size="large" />
        </div>
      </template>
      <TreeTable :value="getTableData" :pt="treeTablePT" size="small">
        <Column field="title" header="Название" expander filterMode="strict">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Checkbox v-if="slotProps.node.child" v-model="choosen[slotProps.node.parent]['variants'][
                slotProps.node.data.title
                ]
                " :inputId="slotProps.node.data.key" binary @update:modelValue="
                  onToggleSelection(
                    slotProps.node.parent,
                    slotProps.node.data.title,
                  )
                  " :disabled="isChecboxInactive(
                  slotProps.node.parent,
                  slotProps.node.data.title,
                )
                  " />
              <span :class="{
                'text-color-secondary':
                  isChecboxInactive(
                    slotProps.node.parent,
                    slotProps.node.data.title,
                  ) && slotProps.node.child,
              }">{{ slotProps.node.data.title }}</span>
            </div>
          </template>
          <template #filter>
            <InputText v-model="filters.title" type="text" placeholder="Название" />
          </template>
        </Column>
        <Column field="similarity" header="Схожесть" v-if="controlState.mode == 'rup'">
          <template #body="slotProps">
            <span>{{ slotProps.node.data.similarity }}</span>
            <span v-if="
              slotProps.node.child &&
              rupData.bestMatch[slotProps.node.data.title].target !=
              slotProps.node.parent
            " v-tooltip:left="rupData.bestMatch[slotProps.node.data.title].target
                " class="text-color-secondary">
              ({{ rupData.bestMatch[slotProps.node.data.title].similarity }})
            </span>
          </template>
        </Column>
        <Column field="period" header="Семестр" />
        <Column field="control" header="Контроль" filterMode="lenient">
          <template #filter>
            <Select v-model="filters.control" showClear :options="controlSelectOptions" />
          </template>
        </Column>
        <Column field="zet" header="ЗЕТ" />
      </TreeTable>
    </Panel>
    <div class="flex flex-column gap-4" style="min-width: 500px">
      <RupControlPanel v-model="controlState" />
      <Panel>
        <template #header>
          <div class="flex flex-row w-fit alighn-items-center gap-2">
            <span class="font-semibold">Выбранные дисциплины</span>
            <Help :message="choosedDiscipplinesHelpMessage" />
          </div>
        </template>
        <DataTable :value="choosedForDataTable.solved" v-if="choosedForDataTable.solved.length > 0">
          <Column field="title" header="Название" />
          <Column field="id" header="" />
        </DataTable>
      </Panel>
      <Panel>
        <template #header>
          <div class="flex flex-row w-fit alighn-items-center gap-2">
            <span class="font-semibold">Расхождения</span>
            <Help :message="rupHelpMsg" />
          </div>
        </template>
        <DataTable :value="choosedForDataTable.unsolved">
          <Column field="title" header="Название" />
          <Column field="id" header="" />
        </DataTable>
      </Panel>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, computed, ref, watch } from "vue";
import {
  Panel,
  TreeTable,
  Column,
  InputText,
  Select,
  Slider,
  Checkbox,
  DataTable,
} from "primevue";
import MapsService from "../../services/mapsService";
import Help from "../UI/Help.vue";
import RupControlPanel from "./RupControlPanel.vue";
import { useToast } from "primevue";

const props = defineProps({
  source: Object,
  target: Object,
});

const toast = useToast();
const choosen = ref({});
const filters = ref({
  title: null,
  control: null,
});

const rupData = reactive({
  source: [],
  target: [],
  same: [],
  similar: [],
  bestMatch: {},
});

const controlState = ref({
  mode: "rup",
  withLowCourse: false,
  threshold: 0.1,
  showMatching: true,
  showWithVariants: true,
  showWithoutVariants: true,
});

const treeTablePT = {
  row: ({ props }) => {
    if (controlState.value.mode != "rup")
      return {
        class: ["row-inert"],
      };

    return {
      class: {
        "row-same": props.node.type == "same",
        "row-variant": props.node.type == "variant",
        "row-no-variant": props.node.type == "noVariants",
      },
    };
  },
};

const onToggleSelection = (parent, child) => {
  Object.entries(choosen.value[parent]['variants']).forEach(([c, v]) => {
    if (c != child) choosen.value[parent]['variants'][c] = false;
  });
};


const controlSelectOptions = computed(() => {
  const controls = new Set();
  
  for (const item of [...rupData.same, ...rupData.target, ...rupData.source]) {
    if (item && item.control) {
      controls.add(item.control);
    }
  }

  for (const similarGroup of rupData.similar || []) {
    if (similarGroup && similarGroup.variants) {
      for (const variant of similarGroup.variants) {
        if (variant && variant.control) {
          controls.add(variant.control);
        }
      }
    }
  }
  
  return [...controls];
});

const choosedForDataTable = computed(() => {
  let res = [];
  for (const [parent, childs] of Object.entries(choosen.value)) {
    const choosedChilds = Object.entries(childs['variants']).reduce(
      (acc, [child, isChoosed]) => {
        if (isChoosed) acc.push({ title: child, parent: parent });
        return acc;
      },
      [],
    );

    choosedChilds.forEach((el) => {
      res.push({ ...el, id: res.length + 1 });
    });
  }
  let unsolved = filteredTarget.value
    .filter((el) => !res.some((solvEl) => el.title == solvEl.parent))
    .reduce((acc, el) => {
      acc.push({ ...el, id: acc.length + 1 });
      return acc;
    }, []);

  return { solved: res, unsolved };
});

const isChecboxInactive = (parent, child) => {
  const firstCheckedParent = Object.entries(choosen.value).reduce(
    (acc, [p, childs]) => {
      if (childs['variants'][child] && !acc) {
        acc = p;
      }
      return acc;
    },
    null,
  );

  if (!firstCheckedParent) return false;
  return firstCheckedParent != parent;
};

const getVariantsByTitle = (title) => {
  const res = rupData.similar.filter((item) => item.title == title);
  return res[0] ? res[0].variants : [];
};

const getTableDataRups = computed(() => {
  let same = [];

  if (controlState.value.showMatching) {
    for (const [i, value] of rupData.same.entries()) {
      same.push({
        key: `${i}`,
        data: value,
        type: "same",
      });
    }
  }

  const len_same = same.length;

  let data = []
  const without_variants = [];

  for (const [i, value] of rupData.target.entries()) {
    let variants = [];
    const similarVariants = getVariantsByTitle(value.title);


    for (const [j, variantData] of similarVariants.entries()) {
      if (variantData.similarity >= controlState.value.threshold)
        variants.push({
          key: `${i + len_same}-variant-${j}`,
          data: variantData,
          type: "variant",
          child: true,
          parent: value.title,
        });
    }


    if (variants.length == 0) {
      without_variants.push({
        key: `${i + len_same}`,
        data: value,
        type: "noVariants",
      });
      continue;
    }

    data.push({
      key: `${i + len_same}`,
      data: value,
      type: "variant",
      children: variants.length > 0 ? variants : undefined,
    });
  }

  let res = []
  res.push(...same.sort((a, b) => sorter(a, b)))
  if (controlState.value.showWithVariants)
    res.push(...data.sort((a, b) => sorter(a, b)))
  if (controlState.value.showWithoutVariants)
    res.push(...without_variants.sort((a, b) => sorter(a, b)))
  return res;
})

const getTableDataPlan = computed(() => {
  let plandata = []
  const mode = controlState.value.mode

  for (const [i, value] of rupData.same.entries()) {
    plandata.push({
      key: `${i}`,
      data: value,
      type: mode,
    });
  }
  const diff = (mode === 'source' ? rupData.source : rupData.target)
  const sameLen = plandata.length
  for (const [i, value] of diff.entries()) {
    plandata.push({
      key: `${i + sameLen}`,
      data: value,
      type: mode,
    });
  }
  return plandata
})

const filteredTarget = computed(() => {
  if (!controlState.value.withLowCourse)
    return rupData.target
  return rupData.target.filter((el) => el.period <= props.target.sem - 2)
})

watch(rupData, () => {
  if (!rupData.similar)
    return

  for (const [i, value] of rupData.target.entries()) {
    let variants = [];
    const similarVariants = getVariantsByTitle(value.title);
    for (const [j, variantData] of similarVariants.entries()) {
      if (variantData.similarity < controlState.value.threshold)
        continue

      variants.push({
        title: variantData.title,
      });
    }
    if (variants.length == 0) {
      continue;
    }
    variants = variants.reduce((acc, curr) => {
      acc[curr.title] = false;
      return acc;
    }, {});

    choosen.value[value.title] = {
      variants: variants,
      period: value.period
    }
  }
})

const sorter = (a, b) => {
  let order = a.data.period - b.data.period;
  if (order === 0) {
    const ac = a.data.control?.length || -1
    const bc = b.data.control?.length || -1
    order += ac - bc
  }
  return order
}

const getTableData = computed(() => {
  let res;
  if (controlState.value.mode === 'rup')
    res = getTableDataRups.value
  else {
    res = getTableDataPlan.value
    res.sort((a, b) => sorter(a, b))
  }

  if (controlState.value.withLowCourse) {
    res = res.filter((el) => el.data.period <= props.target.sem - 2)
  }

  if (filters.value.title)
    res = res.filter((el) => el.data.title.toLowerCase().includes(filters.value.title.toLowerCase()))

  if (filters.value.control)
    res = res.filter((el) => {
      return el.data.control == filters.value.control ||
        (el.children && el.children.some(
          (child) => child.data.control == filters.value.control
        ))
    }) 
  return res

});


const fetchRupData = async () => {
  try {
    console.log(props.source)
    const source = {
        num: props.source.num,
        sem: props.source.sem,
      }

    const target = {
        num: props.target.num,
        sem: props.target.sem,
      }
    const data = await MapsService.getRups(source, target);
    rupData.source = data.source;
    rupData.target = data.target;
    rupData.same = data.same;
    rupData.similar = data.similar;
    rupData.bestMatch = data.best_match;
  } catch (err) {
    toast.add({
      severity: "error",
      message: "Error",
      detail: "Не удалось загрузить данные",
      life: 3000,
    });
    console.error(err)
  }
};

const studyHelpMessage =
  `В данной панели представлена информация из учебного плана, на который переводиться студент.
У дисциплин могут быть варианты - дисциплины из предыдущего учебного плана, которые могут быть зачтены.

Цветовая маркировка:
• <span class='font-semibold' style="color: #3e8b41">Зеленая</span> - дисциплины, полностью совпадающие в обоих планах
• <span class='font-semibold' style="color: #3e848d">Синяя</span> - дисциплины с вариантами соответствия
• <span class='font-semibold' style="color: #863e8d">Фиолетовая</span> - дисциплины без вариантов соответствия

Функции:
- Используйте чекбоксы для выбора соответствующей дисциплины, чтобы зачесть ее
- Колонка "Схожесть" показывает процент соответствия между дисциплинами
- Значение в скобках указывает на лучшее соответствие из другого блока
- Фильтры помогут быстрее найти нужную дисциплину

Справа отображаются выбранные соответствия и оставшиеся расхождения между планами.`

const choosedDiscipplinesHelpMessage = `В данной панели отображаются дисциплины, которые были выбраны для зачета.`
const rupHelpMsg = `В данной панели представлен список расхождений при смене учебного плана.`
onMounted(async () => {
  await fetchRupData();
});
</script>

<style scoped>
:deep(.p-treetable .p-treetable-tbody > tr) {
  box-sizing: border-box;
}

:deep(.p-treetable .p-treetable-tbody > tr.row-same > td:first-child) {
  border-left: 5px solid #3e8b41 !important;
}

:deep(.p-treetable .p-treetable-tbody > tr.row-variant > td:first-child) {
  border-left: 5px solid #3e848d !important;
}

:deep(.p-treetable .p-treetable-tbody > tr.row-no-variant > td:first-child) {
  border-left: 5px solid #863e8d !important;
}

:deep(.p-treetable .p-treetable-tbody > tr.row-inert > td:first-child) {
  border-left: 5px solid light-dark(var(--p-surface-100), var(--p-surface-700)) !important;
}
</style>
