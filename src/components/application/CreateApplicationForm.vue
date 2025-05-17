<template>
  <div
    class="application-panel flex flex-column gap-3 justify-content-center m-auto montserrat-font"
  >
    <Panel>
      <template #header>
        <h3 v-if="applicationType === 'change'">Зявление на смену условий обучения</h3>
        <h3 v-else-if="applicationType === 'reinstatement'">Зявление на восстановление</h3>
        <h3 v-else-if="applicationType === 'transfer'">Зявление на перевод из другого ВУЗа</h3>
      </template>
      <div class="programs flex flex-column gap-4 mb-3">
        <ApplicationHeader
          v-model="model.header"
          v-model:is-valid="formValidation.header"
          :type="applicationType"
          :show-validation-errors
          :editable="props.editable"
        />

        <Program
          v-for="(programConfig, index) in programConfigs"
          :key="`program-${index}`"
          v-model="model.programs[index]"
          v-model:is-valid="formValidation.programs[index]"
          :type="programConfig.type"
          :another-university="programConfig.anotherUniversity"
          :show-validation-errors="showValidationErrors"
          :editable="props.editable"
          :select-options="options"
          :is-options-loading="isOptionsLoading"
        />

        <ApplicationFooter
          v-model="model.footer"
          v-model:is-valid="formValidation.footer"
          :show-validation-errors
          :type="applicationType"
          :editable="props.editable"
        />
        <ApplicationFiles
          v-model:is-valid="formValidation.files"
          :type="applicationType"
          :is-transfer-to-budget="isChangeToBudget"
          :show-validation-errors
          :editable="props.editable"
          :attachments="model.attachments"
          @update:files="onFilesChanged"
        />
        <CompletedDisciplinesDialog
          v-if="applicationType == 'transfer'"
          v-model="model.passed"
        />
      </div>
      <div
        v-if="props.editable"
        class="flex flex-column w-full align-items-center"
      >
        <Button
          :label="submitLabel"
          :icon="submitIcon"
          @click="onSubmit"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, reactive, onMounted } from 'vue';
import { Panel, Button } from 'primevue';
import Program from './application_form/Program.vue';
import ApplicationHeader from './application_form/ApplicationHeader.vue';
import ApplicationFooter from './application_form/ApplicationFooter.vue';
import ApplicationFiles from './application_form/ApplicationFiles.vue';
import MapsService from '../../services/mapsService.js';
import CompletedDisciplinesDialog from './CompletedDisciplinesDialog.vue';
import Toast from '../../tools/toast.js';
import { useAuthStore } from '../../store/authStore.js';
import getCurrentSemester from '../../tools/utils.js';

const showValidationErrors = ref(false);
const emit = defineEmits(['valid-submit']);
const toast = new Toast();
const authStore = useAuthStore();

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
});

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
  cities: [{ title: 'Москва', value: 'Москва' }],
  semesters: [
    { title: '1 семестр', value: 1 },
    { title: '2 семестр', value: 2 },
    { title: '3 семестр', value: 3 },
    { title: '4 семестр', value: 4 },
    { title: '5 семестр', value: 5 },
    { title: '6 семестр', value: 6 },
    { title: '7 семестр', value: 7 },
    { title: '8 семестр', value: 8 },
    { title: '9 семестр', value: 9 },
    { title: '10 семестр', value: 10 },
  ],
});
const isOptionsLoading = ref(false);

const submitLabel = computed(() => {
  return props.isEdit ? 'Сохранить заявление' : 'Подать заявление';
});
const submitIcon = computed(() => {
  return props.isEdit ? 'pi pi-save' : 'pi pi-check';
});

const programConfigs = computed(() => {
  const configs = [];
  if (model.value.type === 'reinstatement') {
    configs.push({ type: 'before', anotherUniversity: false });
  } else if (model.value.type === 'change') {
    configs.push({ type: 'current', anotherUniversity: false });
  } else if (model.value.type === 'transfer') {
    configs.push({ type: 'current', anotherUniversity: true });
  }

  configs.push({ type: 'first', anotherUniversity: false });
  configs.push({ type: 'second', anotherUniversity: false });

  return configs;
});

const isChangeToBudget = computed({
  get: () => {
    if (applicationType.value !== 'change') return false;
    const currentBase = formData.programs[0].base;
    const newBases = [formData.programs[1].base, formData.programs[2].base];
    return newBases.includes('Бюджетная') && currentBase !== 'Бюджетная';
  },
});

const isFormValid = computed(() => {
  return (
    formValidation.value.header &&
    formValidation.value.programs.every((isValid) => isValid) &&
    formValidation.value.footer &&
    formValidation.value.files
  );
});

const onSubmit = () => {
  showValidationErrors.value = true;
  if (!isFormValid.value) {
    toast.warn('Форма заоплнена неверно');
    return;
  }
  model.value.date = new Date();
  emit('valid-submit', model.value);
};

const onFilesChanged = (files) => {
  model.value.files = files;
};

const fetchOptions = async () => {
  isOptionsLoading.value = true;
  const response = await MapsService.fetchAllMaps();
  for (const fac of response) {
    for (const prog of fac.directions) {
      if (!options.value.programs[prog.okco_code])
        options.value.programs[prog.okco_code] = {
          name: prog.okco_name,
          profiles: [],
        };

      options.value.programs[prog.okco_code].profiles.push({
        title: prog.name,
        form_id: prog.form_educ,
        year: prog.year,
        semCount: prog.sem_count,
        aup: prog.code,
      });
    }
  }
  isOptionsLoading.value = false;
};

const getCurrentProgram = (user_data, curr_prog) => {
  let program = {...curr_prog};
  if (user_data.enter_year && user_data.specializaiton && !(curr_prog.profile && curr_prog.osko)) {
    const enter_year = user_data.enter_year.split('/')[0];
    for (const [okso, program] of options.value.programs) {
      const profile = program.profiles.filter((el) => el.title == user_data.specializaiton && el.year == enter_year);
      if (profile) {
        program.profile = profile.aup;
        program.okso = okso;
        break;
      }
    }
  }

  if (user_data.finance && !curr_prog.base) program.base = user_data.finance;
  if (user_data.form && !curr_prog.form) program.form = user_data.form;
  if (user_data.course && !curr_prog.course) {
    let current_semester = getCurrentSemester().semester;
    program.semester = user_data.course * 2 + current_semester - 1;
  }
  program.university = !curr_prog.university ? 'Москва' : curr_prog.university
  return program;
};



const prefillApplication = () => {
  const user_data = authStore.user_data;
  model.value.programs[0] = getCurrentProgram(user_data, model.value.programs[0]);
};

onMounted(async () => {
  try {
    await fetchOptions();
  } catch (err) {
    toast.error('Не удалось загрузить данные, попробуйте позже.');
    throw err;
  }
  prefillApplication();
});
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .application-panel :deep(.p-panel-content) {
    padding: 0.5rem;
  }
}
</style>
