<template>
  <Panel header="Документы" class="flex flex-column">
      <Panel v-for="(category, index) in filteredCategories" :key="index" :header="category.title" class="mb-3">
        <p class="text-sm text-500 mb-3 mt-2">{{ category.description }}</p>
        <!-- Single file upload category row -->
        <div v-if="!category.multipleFiles" class="file-row flex align-items-center p-2 border-0 border-round-sm surface-50 mb-3">
          <div v-if="files[category.id] && files[category.id].length > 0" class="flex-1 flex align-items-center">
            <i class="pi pi-file text-primary mr-2"></i>
            <span class="text-truncate">{{ files[category.id][0].name }}</span>
          </div>
          <div v-else class="flex-1 text-500">
            <span>Файл не выбран</span>
          </div>
          
          <div>
            <Button v-if="files[category.id] && files[category.id].length > 0"
              icon="pi pi-trash" 
              severity="danger" 
              text rounded 
              @click="removeFile(category.id, 0)" 
              aria-label="Удалить файл" />
            <Button v-else
              label="Загрузить" 
              icon="pi pi-upload" 
              size="small"
              outlined
              @click="triggerFileInput(category.id)" />
          </div>
        </div>
        
        <!-- Multiple files upload category rows -->
        <div v-else>
          <div v-for="(file, fileIndex) in files[category.id]" :key="fileIndex" 
            class="file-row flex align-items-center p-2 pl-3 border-0 border-round-sm surface-50 mb-2">
            <div class="flex-1 flex align-items-center">
              <i class="pi pi-file text-primary mr-2"></i>
              <span class="text-truncate">{{ file.name }}</span>
            </div>
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              text rounded 
              @click="removeFile(category.id, fileIndex)" 
              aria-label="Удалить файл" />
          </div>
          
          <div class="flex justify-content-end mt-3">
            <Button 
              label="Добавить файл" 
              icon="pi pi-plus" 
              size="small"
              outlined
              @click="triggerFileInput(category.id)" />
          </div>
        </div>
        
        <!-- Hidden file inputs -->
        <input 
          type="file" 
          :ref="el => setFileInputRef(category.id, el)" 
          :multiple="category.multipleFiles" 
          accept="application/pdf,image/*"
          class="hidden-file-input" 
          @change="onFileSelected($event, category.id)" />
    </Panel>
  </Panel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const props = defineProps({
    type: {
        type: String,
        validator: (value) => ['reinstatement', 'change', 'transfer'].includes(value),
        required: true
    },
    isTransferToBudget: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:files']);

const categories = [
    {
        id: 'passport',
        title: 'Паспорт',
        description: 'Загрузите скан паспорта (страницы с фото и с регистрацией)',
        multipleFiles: false,
        types: ['reinstatement', 'change', 'transfer']
    },
    {
        id: 'recordBook',
        title: 'Копия зачетной книжки',
        description: 'Загрузите скан зачетной книжки',
        multipleFiles: false,
        types: ['change', 'toBudget']
    },
    {
        id: 'statusDocument',
        title: 'Документ, подтверждающий отнесение к определенным категориям граждан',
        description: 'Загрузите документ, подтверждающий ваш статус (при наличии)',
        multipleFiles: false,
        types: ['change', 'toBudget']
    },
    {
        id: 'studyPeriod',
        title: 'Справка о периоде обучения',
        description: 'Загрузите справку о периоде обучения',
        multipleFiles: false,
        types: ['transfer', "change"]
    },
    {
        id: 'consent',
        title: 'Согласие на обработку персональных данных',
        description: 'Загрузите подписанное согласие на обработку персональных данных',
        multipleFiles: false,
        types: ['transfer']
    },
    {
        id: 'achievements',
        title: 'Индивидуальные достижения (по желанию)',
        description: 'Загрузите документы, подтверждающие ваши индивидуальные достижения',
        multipleFiles: true,
        types: ['change',]
    },
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
const fileInputRefs = ref({});

// Method to expose files for parent component
const getFiles = () => {
    return files.value;
};

// Make the getFiles method available to parent components
defineExpose({ getFiles });

// Set file input reference
const setFileInputRef = (categoryId, el) => {
    if (el) {
        fileInputRefs.value[categoryId] = el;
    }
};

// Trigger file input click
const triggerFileInput = (categoryId) => {
    if (fileInputRefs.value[categoryId]) {
        fileInputRefs.value[categoryId].click();
    }
};

// Handle file selection
const onFileSelected = (event, categoryId) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (!files.value[categoryId]) {
        files.value[categoryId] = [];
    }
    
    const category = categories.find(c => c.id === categoryId);
    
    if (category.multipleFiles) {
        files.value[categoryId] = [...files.value[categoryId], ...selectedFiles];
    } else {
        files.value[categoryId] = [selectedFiles[0]];
    }
    
    // Reset the input to allow selecting the same file again
    event.target.value = '';
    
    // Emit files update
    emit('update:files', files.value);
};

// Remove file
const removeFile = (categoryId, fileIndex) => {
    if (files.value[categoryId]) {
        files.value[categoryId].splice(fileIndex, 1);
        emit('update:files', files.value);
    }
};

// Initialize files object
onMounted(() => {
    filteredCategories.value.forEach(category => {
        files.value[category.id] = [];
    });
});
</script>

<style scoped>
.file-documents-panel {
  width: 100%;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 350px;
}

.hidden-file-input {
  display: none;
}

.file-row {
  min-height: 3rem;
}
</style>file-row