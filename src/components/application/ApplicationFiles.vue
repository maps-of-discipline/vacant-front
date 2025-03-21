<template>
  <Panel header="Документы" class="flex flex-column">
    <FileUpload
      v-for="(category, index) in filteredCategories" 
      :key="index"
      :title="category.title"
      :description="category.description"
      :multiple="category.multipleFiles"
      :required="category.required"
      :validationMessage="category.validationMessage"
      :showValidationErrors="showValidationErrors"
      v-model="files[category.id]"
      v-model:isValid="categoryValidations[category.id]"
    />
  </Panel>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Panel from 'primevue/panel';
import FileUpload from '../UI/FileUpload.vue';

const props = defineProps({
    type: {
        type: String,
        validator: (value) => ['reinstatement', 'change', 'transfer'].includes(value),
        required: true
    },
    isTransferToBudget: {
        type: Boolean,
        default: false
    },
    showValidationErrors: {
        type: Boolean,
        default: false
    },
    isValid: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:files', 'update:isValid']);

const categories = [
    {
        id: 'passport',
        title: 'Паспорт',
        description: 'Загрузите скан паспорта (страницы с фото и с регистрацией)',
        multipleFiles: false,
        required: true,
        validationMessage: 'Необходимо загрузить скан паспорта',
        types: ['reinstatement', 'change', 'transfer']
    },
    {
        id: 'recordBook',
        title: 'Копия зачетной книжки',
        description: 'Загрузите скан зачетной книжки',
        multipleFiles: false,
        required: true,
        validationMessage: 'Необходимо загрузить скан зачетной книжки',
        types: ['change', 'toBudget']
    },
    {
        id: 'statusDocument',
        title: 'Документ, подтверждающий отнесение к определенным категориям граждан',
        description: 'Загрузите документ, подтверждающий ваш статус (при наличии)',
        multipleFiles: false,
        required: false,
        types: ['change', 'toBudget']
    },
    {
        id: 'studyPeriod',
        title: 'Справка о периоде обучения',
        description: 'Загрузите справку о периоде обучения',
        multipleFiles: false,
        required: true,
        validationMessage: 'Необходимо загрузить справку о периоде обучения',
        types: ['transfer', 'change']
    },
    {
        id: 'consent',
        title: 'Согласие на обработку персональных данных',
        description: 'Загрузите подписанное согласие на обработку персональных данных',
        multipleFiles: false,
        required: true,
        validationMessage: 'Необходимо загрузить согласие на обработку персональных данных',
        types: ['transfer']
    },
    {
        id: 'achievements',
        title: 'Индивидуальные достижения (по желанию)',
        description: 'Загрузите документы, подтверждающие ваши индивидуальные достижения',
        multipleFiles: true,
        required: false,
        types: ['change']
    }
];

const filteredCategories = computed(() => {
    if (props.isTransferToBudget) {
        return categories.filter(category => category.types.includes(props.type));
    } else {
        return categories
            .filter(category => category.types.includes(props.type))
            .filter(category => !category.types.includes('toBudget'));
    }
});

const files = ref({});
const categoryValidations = ref({});

// Initialize files and validations objects
onMounted(() => {
    filteredCategories.value.forEach(category => {
        files.value[category.id] = [];
        categoryValidations.value[category.id] = !category.required;
    });
});

// Update files when categories change (when type changes)
watch(() => filteredCategories.value, (newCategories) => {
    // Reset files and validations for new categories
    const newFiles = {};
    const newValidations = {};
    
    newCategories.forEach(category => {
        // Keep existing files if they exist
        newFiles[category.id] = files.value[category.id] || [];
        newValidations[category.id] = !category.required;
    });
    
    files.value = newFiles;
    categoryValidations.value = newValidations;
}, { immediate: true });

// Calculate overall validation status
const isValid = computed(() => {
    // Check if all required categories have valid files
    return filteredCategories.value
        .filter(category => category.required)
        .every(category => categoryValidations.value[category.id]);
});

// Method to expose files for parent component
const getFiles = () => {
    return files.value;
};

// Make the getFiles method available to parent components
defineExpose({ getFiles });

// Watch for validation changes and notify parent
watch(isValid, (newValue) => {
    emit('update:isValid', newValue);
}, { immediate: true });

// Watch for file changes and notify parent
watch(files, (newFiles) => {
    emit('update:files', newFiles);
}, { deep: true });
</script>

<style scoped>
.file-documents-panel {
  width: 100%;
}
</style>