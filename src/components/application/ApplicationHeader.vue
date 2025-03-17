<template>
    <Panel v-if="type === 'reinstatement'" class="panel-no-header">
        <div class="flex flex-column gap-2 mb-4">
            <label class="mb-2">Цель восстановления: </label>
            <div class="flex flex-row gap-2 align-items-center">
                <div class="flex items-center gap-2">
                    <RadioButton v-model="modelValue.purpose" inputId="10" name="purpose" value="continue_study" />
                    <label for="male">Продолжение обучения</label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioButton v-model="modelValue.purpose" inputId="20" name="purpose" value="gia" />
                    <label for="male">Подготовка и прохождение ГИА</label>
                </div>
            </div>
        </div>

        <div class="flex flex-row gap-2 mb-3">
            <Checkbox v-model="modelValue.isVacationNeeded" binary />
            <label for="male">Предоставление каникул в пределах срока освоения образовательной программы</label>
        </div>

        <div class="flex flex-row gap-2 mb-2">
            <DatePicker v-model="modelValue.begin_year" class="w-full" view="year" placeholder="Год поступления" />
            <DatePicker v-model="modelValue.end_year" class="w-full" view="year" placeholder="Год отчисления" />
            <InputText v-model="modelValue.studyGroup" placeholder="Учебная группа" />
        </div>
    </Panel>

    <Panel v-if="type === 'change'" header="Прошу изменить мне условия обучения в связи с: ">
        <Textarea v-model="modelValue.reason" id="purpose" autoResize class="w-full" rows="3" />
    </Panel>

    <Panel v-if="type === 'transfer'" header="Для аспирантов: ">
        <div class="flex flex-row gap-3 align-items-center">
            <label>Номер курса для продолжения обучения: </label>
            <Select v-model="modelValue.continue_year" class="w-min" :options="courseOptions" placeholder="Курс"
                optionLabel="title" optionValue="value" />
        </div>
    </Panel>
</template>

<script>
// Define the props outside of setup
export default {
    props: {
        type: {
            type: String,
            required: true,
            validator: (value) => ['reinstatement', 'change', 'transfer'].includes(value)
        },
        modelValue: {
            type: Object,
            required: true
        }
    },
    emits: ['update:modelValue']
}
</script>

<script setup>
import {
    DatePicker,
    Checkbox,
    InputText,
    RadioButton,
    Panel,
    Textarea,
    Select
} from "primevue";
import { watch, onMounted } from "vue";

const props = defineProps(['type', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

// Create default objects based on the type
const getDefaultObject = (type) => {
    switch (type) {
        case 'reinstatement':
            return {
                is_vacation_need: false,
                begin_year: null,
                end_year: null,
                group: "",
                purpose: "continue_study",
                type: 'reinstatement'
            };
        case 'change':
            return {
                purpose: "",
                type: 'change'
            };
        case 'transfer':
            return {
                continue_year: null,
                type: 'transfer'
            };
        default:
            return {};
    }
};

const courseOptions = [
    { title: "1 курс", value: 1 },
    { title: "2 курс", value: 2 },
];

// Initialize model when component mounts
onMounted(() => {
    if (!props.modelValue || Object.keys(props.modelValue).length === 0) {
        emit('update:modelValue', getDefaultObject(props.type));
    } else if (props.modelValue.type !== props.type) {
        
        const newDefault = getDefaultObject(props.type);
        emit('update:modelValue', newDefault);
    }
});

// Update model value if type changes
watch(() => props.type, (newType) => {
    const currentData = props.modelValue || {};
    const newDefault = getDefaultObject(newType);
    
    // Reset model with new structure while keeping any matching properties
    emit('update:modelValue', { 
        ...newDefault,
        ...Object.keys(currentData)
            .filter(key => Object.keys(newDefault).includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: currentData[key] }), {})
    });
}, { immediate: true });
</script>

<style scoped>
.panel-no-header :deep(.p-panel-header) {
    padding: 0;
    padding-bottom: 18px;
    height: 0;
    min-height: 0;
    border: none;
}
</style>