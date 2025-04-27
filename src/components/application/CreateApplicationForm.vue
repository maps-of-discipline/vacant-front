<template>
  <div
    class="application-panel flex flex-column gap-3 justify-content-center m-auto montserrat-font"
  >
    <Panel>
      <template #header>
        <h3 v-if="applicationType === 'change'">
          Зявление на смену условий обучения
        </h3>
        <h3 v-else-if="applicationType === 'reinstatement'">
          Зявление на восстановление
        </h3>
        <h3 v-else-if="applicationType === 'transfer'">
          Зявление на перевод из другого ВУЗа
        </h3>
      </template>
      <pre>{{ options }}</pre>
      <div class="programs flex flex-column gap-4 mb-3">
        <ApplicationHeader
          :type="applicationType"
          v-model="model.header"
          :showValidationErrors
          v-model:isValid="formValidation.header"
          :editable="props.editable"
        />

        <Program
          v-for="(programConfig, index) in programConfigs"
          :key="`program-${index}`"
          v-model="model.programs[index]"
          :type="programConfig.type"
          :anotherUniversity="programConfig.anotherUniversity"
          :showValidationErrors="showValidationErrors"
          v-model:isValid="formValidation.programs[index]"
          :editable="props.editable"
          :selectOptions='options'
          :isOptionsLoading='isOptionsLoading'  
        />

        <ApplicationFooter
          :showValidationErrors
          :type="applicationType"
          v-model="model.footer"
          v-model:isValid="formValidation.footer"
          :editable="props.editable"
        />
        <ApplicationFiles
          :type="applicationType"
          :isTransferToBudget="isChangeToBudget"
          v-model:isValid="formValidation.files"
          :showValidationErrors
          :editable="props.editable"
        />
      </div>
      <div
        class="flex flex-column w-full align-items-center"
        v-if="props.editable"
      >
        <Button :label="submitLabel" :icon="submitIcon" @click="onSubmit" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineEmits,
  reactive,
  watch,
  onMounted,
} from "vue";
import { Panel, Button, useToast } from "primevue";
import Program from "./Program.vue";
import ApplicationHeader from "./ApplicationHeader.vue";
import ApplicationFooter from "./ApplicationFooter.vue";
import ApplicationFiles from "./ApplicationFiles.vue";
import MapsService from '../../services/mapsService.js'


const showValidationErrors = ref(false);
const emit = defineEmits(["valid-submit"]);
const toast = useToast();

const model = defineModel({
  type: Object,
  required: true,
});

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
})

const applicationType = computed(() => {
  return model.value.type;
});

const formValidation = ref({
  header: false,
  programs: [false, false, false],
  footer: false,
  files: false,
});

const formData = reactive({
  header: {},
  programs: [{}, {}, {}],
  footer: {},
});


const options = ref({
  programs: {},
  cities: [
    {title: "Москва", value: "Москва"}
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
  ],
})
const isOptionsLoading = ref(false)

const submitLabel = computed(() => { return (props.isEdit) ? 'Сохранить заявление' : "Подать заявление" })
const submitIcon = computed(() => { return (props.isEdit) ? 'pi pi-save' : "pi pi-check" })


const programConfigs = computed(() => {
  const configs = [];
  console.debug(model.value.type)
  if (model.value.type === "reinstatement") {
    configs.push({ type: "before", anotherUniversity: false });
  } else if (model.value.type === "change") {
    configs.push({ type: "current", anotherUniversity: false });
  } else if (model.value.type === "transfer") {
    configs.push({ type: "current", anotherUniversity: true });
  }

  configs.push({ type: "first", anotherUniversity: false });
  configs.push({ type: "second", anotherUniversity: false });

  return configs;
});


const isChangeToBudget = computed({
  get: () => {
    if (applicationType !== "change") return false;
    const currentBase = formData.programs[0].base;
    const newBases = [formData.programs[1].base, formData.programs[2].base];
    return newBases.includes("Бюджетная") && currentBase !== "Бюджетная";
  },
});

const isFormValid = computed(() => {
  return (
    formValidation.value.header &&
    formValidation.value.programs.every((isValid) => isValid) &&
    formValidation.value.footer
    // && formValidation.files
  );
});


const onSubmit = () => {
  showValidationErrors.value = true;
  if (!isFormValid.value) {
    toast.add({
      severity: "warn",
      summary: "Ошибка",
      detail: "Форма заоплнена неверно",
      life: 3000,
    })
    return
  }
  model.value.date = new Date()
  emit('valid-submit', model.value)
};

const fetchOptions = async () => {
  isOptionsLoading.value = true;
  const response = await MapsService.fetchAllMaps()
  for (const fac of response) {
    for (const prog of fac.directions) {
      if (!options.value.programs[prog.okco_code])
        options.value.programs[prog.okco_code] = {
          name: prog.okco_name,
          profiles: []
        }
      
      options.value.programs[prog.okco_code].profiles.push({
          title: prog.name, 
          form_id: prog.form_educ,
          year: prog.year,
          aup: prog.code
        })
    }
  }
  isOptionsLoading.value = false;
}

onMounted(async () => {
  try {
    if (!props.isEdit)
      return
    await fetchOptions();
  } catch (err){
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удалось загрузить данные, попробуйте позже.",
      life: 3000,
    })
    throw err
  }
})
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .application-panel :deep(.p-panel-content) {
    padding: 0.5rem;
  }
}
</style>
