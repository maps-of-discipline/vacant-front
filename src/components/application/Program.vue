<template>
  <Panel :header="getPanelHeader">
    <div class="flex flex-row gap-2 mb-2">
      <Select class="w-full" v-model="program.okso" filter :options="selectOptions.directions"
        placeholder="Направление обучния" />
      <InputText class="w-full" v-model="program.profile" placeholder="Профиль" v-if="anotherUniversity" />
      <Select v-else class="w-full" v-model="program.profile" :options="selectOptions.profiles" placeholder="Профиль" />
    </div>

    <div class="flex flex-row gap-2 align-items-center">
      <p class="mr-2">Основа обучния:</p>
      <div class="flex items-center gap-2">
        <RadioButton v-model="program.base" :inputId="`base-paid-${props.type}`" :name="`base-${props.type}`" value="Платная" />
        <label :for="`base-paid-${props.type}`">Платная</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="program.base" :inputId="`base-free-${props.type}`" :name="`base-${props.type}`" value="Бюджетная" />
        <label :for="`base-free-${props.type}`">Бюджетная</label>
      </div>
    </div>

    <div class="flex flex-row gap-2 align-items-center">
      <p class="mr-2">Форма обучния:</p>
      <div class="flex items-center gap-2">
        <RadioButton v-model="program.form" :inputId="`form-full-${props.type}`" :name="`form-${props.type}`" value="Очная" />
        <label :for="`form-full-${props.type}`">Очная</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="program.form" :inputId="`form-evening-${props.type}`" :name="`form-${props.type}`" value="Очно-заочная" />
        <label :for="`form-evening-${props.type}`">Очно-заочная</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="program.form" :inputId="`form-distant-${props.type}`" :name="`form-${props.type}`" value="Заочная" />
        <label :for="`form-distant-${props.type}`">Заочная</label>
      </div>
    </div>

    <div class="flex flex-column gap-3">
      <InputText v-if="anotherUniversity" class="w-full" v-model="program.university"
        placeholder="Университет / Филлиал" />
      <Select v-else class="w-full" v-model="program.university" :options="selectOptions.universities"
        placeholder="Университет / Филлиал" />
      <Select class="w-min" v-model="program.sem_num" placeholder="Семестр" :options="selectOptions.semesters"
        optionLabel="title" optionValue="value" />
    </div>
  </Panel>
</template>

<script setup>
import { Select, InputText, RadioButton, Panel } from "primevue";
import { defineModel, computed, onMounted, ref} from "vue";

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
})

onMounted(() => {
  if (props.type && !program.value.type) {
    program.value.type = props.type;
  }
})

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
      profiles: [
        'Profile 1',
        'Profile 2',
        'Profile 3',
        'Profile 4'
      ],
      universities: [
        "Москва",
        "Не Москва"
      ],
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
      ]

    })

  },
})

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
})

</script>

<style scoped>
/* Add any necessary styling */
</style>
