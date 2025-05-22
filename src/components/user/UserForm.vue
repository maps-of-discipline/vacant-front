<template>
  <div class="flex flex-column gap-4">
    <Panel :header="getFullname">
      <div class="flex flex-column">
        <div class="flex flex-row gap-3 mb-3 w-full">
          <div class="w-full">
            <InputMask
              v-model="model.snils"
              mask="999-999-999 99"
              class="w-full"
              placeholder="СНИЛС"
              :invalid="showValidation && !user.snils"
            />
            <Message
              v-if="showValidation && !user.snils"
              severity="error"
              variant="simple"
              size="small"
            >
              Поле должно быть заполнено
            </Message>
          </div>
          <div class="w-full">
            <Select
              v-model="model.course"
              :options="courseSelectOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              placeholder="Курс"
              :invalid="showValidation && !user.course"
            />
            <Message
              v-if="showValidation && !user.course"
              severity="error"
              variant="simple"
              size="small"
            >
              Поле должно быть заполнено
            </Message>
          </div>
        </div>
        <div class="flex flex-column">
          <p>Уведомления</p>
          <div class="flex gap-2">
            <Checkbox
              v-model="model.send_email"
              binary
            />
            <span>Получать оповещения на электронную почту</span>
          </div>
        </div>
      </div>
    </Panel>
    <Panel
      header="Паспорт"
      class="mb-4"
    >
      <div class="flex flex-column gap-3">
        <div class="flex flex-row gap-3">
          <InputMask
            v-model="model.passport_series"
            mask="99 99"
            class="w-full"
            placeholder="Серия"
            :invalid="showValidation && !model.passport_series"
          />
          <InputMask
            v-model="model.passport_number"
            mask="999999"
            class="w-full"
            placeholder="Номер"
            :invalid="showValidation && !model.passport_number"
          />
        </div>
        <Message
          v-if="showValidation && (!model.passport_series || !model.passport_number)"
          severity="error"
          variant="simple"
          size="small"
        >
          Серия и номер паспорта обязательны
        </Message>

        <div class="flex flex-wrap gap-4">
          <label class="font-semibold">Пол:</label>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="model.sex"
              input-id="male"
              name="sex"
              value="Male"
            />
            <label for="male">Муж.</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton
              v-model="model.sex"
              input-id="Female"
              name="sex"
              value="female"
            />
            <label for="female">Жен.</label>
          </div>
        </div>
        <Message
          v-if="showValidation && !model.sex"
          severity="error"
          variant="simple"
          size="small"
        >
          Укажите пол
        </Message>

        <DatePicker
          v-model="model.birthdate"
          placeholder="Дата рождения"
          :invalid="showValidation && !model.birthdate"
        />
        <Message
          v-if="showValidation && !model.birthdate"
          severity="error"
          variant="simple"
          size="small"
        >
          Укажите дату рождения
        </Message>

        <InputText
          v-model="model.passport_birthplace"
          placeholder="Место рождения"
          :invalid="showValidation && !model.passport_birthplace"
        />
        <Message
          v-if="showValidation && !model.passport_birthplace"
          severity="error"
          variant="simple"
          size="small"
        >
          Укажите место рождения
        </Message>

        <InputText
          v-model="model.passport_issued_by"
          placeholder="Кем выдан"
          :invalid="showValidation && !model.passport_issued_by"
        />
        <Message
          v-if="showValidation && !model.passport_issued_by"
          severity="error"
          variant="simple"
          size="small"
        >
          Укажите кем выдан паспорт
        </Message>

        <div class="flex flex-row gap-3">
          <InputMask
            v-model="model.passport_issued_code"
            mask="999-999"
            class="w-full"
            placeholder="Код подразделения"
            :invalid="showValidation && !model.passport_issued_code"
          />
          <DatePicker
            v-model="model.passport_issued_date"
            class="w-full"
            placeholder="Дата выдачи"
            :invalid="showValidation && !model.passport_issued_date"
          />
        </div>
        <Message
          v-if="showValidation && (!model.passport_issued_code || !user.passport_issued_date)"
          severity="error"
          variant="simple"
          size="small"
        >
          Укажите код подразделения и дату выдачи
        </Message>
      </div>
      <Button
        label="Сохранить"
        icon="pi pi-save"
        class="flex m-auto mt-3"
        @click="onSaveUserData"
      />
    </Panel>
  </div>
</template>

<script setup>
import {
  Checkbox,
  Panel,
  InputMask,
  Message,
  Select,
  DatePicker,
  RadioButton,
  InputText,
  Button,
} from 'primevue';
import { useAuthStore } from '../../store/authStore';
import { computed, onBeforeMount, ref, watch } from 'vue';
import AuthService from '../../services/authService';
import Toast from '../../tools/toast';

const authStore = useAuthStore();
const toast = new Toast();
const model = defineModel({
  type: Object,
  default: () => {},
});

model.value = authStore.user_data;

const showValidation = ref(false);

const courseSelectOptions = [
  { label: '1 курс', value: '1' },
  { label: '2 курс', value: '2' },
  { label: '3 курс', value: '3' },
  { label: '4 курс', value: '4' },
  { label: '5 курс', value: '5' },
];

const getFullname = computed(() => {
  return `${model.value.surname} ${model.value.name} ${model.value.patronymic} `;
});

const onSaveUserData = async () => {
  try {
    await AuthService.updateUserData(model.value);

    let auth_data = authStore.auth_data;
    auth_data = await AuthService.refreshTokens(auth_data.access, auth_data.refresh);

    authStore.setAuthData(auth_data.access, auth_data.refresh);
  } catch (err) {
    console.error(err);
    toast.error('Не удалось сохранить данные');
    return;
  }
  toast.success('Данные сохранены');
};

watch(authStore.user_data, (newValue) => {
  for (const [key, value] of Object.entries(newValue)) {
    if (value == 'None') newValue[key] = null;
  }
  console.log(newValue.birthdate);
  newValue.passport_issued_date = new Date(newValue.passport_issued_date);
  newValue.birthdate = new Date(newValue.birthdate);
  model.value = newValue;
});
</script>

<style scoped></style>
