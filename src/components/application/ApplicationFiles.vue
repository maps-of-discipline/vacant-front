<template>
  <Panel header="Документы" class="flex flex-column">
    <div v-for="(category, index) in filteredCategories">
      <FileUpload
        :key="index"
        :title="category.title"
        :description="category.description"
        :multiple="category.multipleFiles"
        :required="category.required"
        :validationMessage="category.validationMessage"
        :showValidationErrors="showValidationErrors"
        :editable='props.editable'
        v-model="files[category.id]"
        v-model:isValid="categoryValidations[category.id]"
      />
    </div>
  </Panel>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Panel from "primevue/panel";
import FileUpload from "../UI/FileUpload.vue";
import DocumentService from "../../services/documnet";
import config from "../../config";

const emit = defineEmits(["update:files", "update:isValid"]);
const files = ref({});
const categoryValidations = ref({});

const props = defineProps({
  type: {
    type: String,
    validator: (value) =>
      ["reinstatement", "change", "transfer"].includes(value),
    required: true,
  },
  isTransferToBudget: {
    type: Boolean,
    default: false,
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
  attachments: {
    type: Array,
  },

});

const categories = [
  {
    id: "passport",
    title: "Паспорт",
    description: "Загрузите скан паспорта (страницы с фото и с регистрацией)",
    multipleFiles: false,
    required: true,
    validationMessage: "Необходимо загрузить скан паспорта",
    types: ["reinstatement", "change", "transfer"],
  },
  {
    id: "recordBook",
    title: "Копия зачетной книжки",
    description: "Загрузите скан зачетной книжки",
    multipleFiles: false,
    required: true,
    validationMessage: "Необходимо загрузить скан зачетной книжки",
    types: ["change", "toBudget"],
  },
  {
    id: "statusDocument",
    title:
      "Документ, подтверждающий отнесение к определенным категориям граждан",
    description: "Загрузите документ, подтверждающий ваш статус (при наличии)",
    multipleFiles: false,
    required: false,
    types: ["change", "toBudget"],
  },
  {
    id: "studyPeriod",
    title: "Справка о периоде обучения",
    description: "Загрузите справку о периоде обучения",
    multipleFiles: false,
    required: true,
    validationMessage: "Необходимо загрузить справку о периоде обучения",
    types: ["transfer"],
  },
  {
    id: "consent",
    title: "Согласие на обработку персональных данных",
    description:
      "Загрузите подписанное согласие на обработку персональных данных",
    multipleFiles: false,
    required: true,
    validationMessage:
      "Необходимо загрузить согласие на обработку персональных данных",
    types: ["transfer"],
  },
  {
    id: "achievements",
    title: "Индивидуальные достижения (по желанию)",
    description:
      "Загрузите документы, подтверждающие ваши индивидуальные достижения",
    multipleFiles: true,
    required: false,
    types: ["change"],
  },
];

const filteredCategories = computed(() => {
  if (props.isTransferToBudget) {
    return categories.filter((category) => category.types.includes(props.type));
  } else {
    return categories
      .filter((category) => category.types.includes(props.type))
      .filter((category) => !category.types.includes("toBudget"));
  }
});

const fetchAttachments = async () => {
  const promises = []
  for (const [category, data] of Object.entries(props.attachments)) {
    const filename = data.filepath.split('/').at(-1)
    const promise = async () => {
      return {category: data.type, file: await DocumentService.getById(data.id, filename)}
    }
    promises.push(promise())
  }

  const res = await Promise.allSettled(promises)

  return res.reduce((acc, el) => {
    if (!acc[el.value.category]) acc[el.value.category] = []
    acc[el.value.category].push(el.value.file)
    return acc
  }, {})
}

watch(() => props.attachments, async (n) => {
  if (n.length > 0) {
    const res = await fetchAttachments()
    files.value = res
  }
})

onMounted(async () => {
  filteredCategories.value.forEach((category) => {
    files.value[category.id] = [];
    categoryValidations.value[category.id] = !category.required;
  });
});


watch(
  () => filteredCategories.value,
  (newCategories) => {
    const newFiles = {};
    const newValidations = {};

    newCategories.forEach((category) => {
      newFiles[category.id] = files.value[category.id] || [];
      newValidations[category.id] = !category.required;
    });

    files.value = newFiles;
    categoryValidations.value = newValidations;
  },
  { immediate: true },
);

const isValid = computed(() => {
  const valid = filteredCategories.value
    .filter((category) => category.required)
    .every((category) => categoryValidations.value[category.id]);
  return valid;
});

const getFiles = () => {
  return files.value;
};

defineExpose({ getFiles });

watch(
  isValid,
  (newValue) => {
    emit("update:isValid", newValue);
  },
  { immediate: true },
);

watch(
  files,
  (newFiles) => {
    emit("update:files", newFiles);
  },
  { deep: true },
);
</script>

<style scoped>
.file-documents-panel {
  width: 100%;
}
</style>
