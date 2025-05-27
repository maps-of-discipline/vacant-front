<template>
  <div class="flex flex-column gap-4">
    <Panel :header="getFullname">
      <div class="flex flex-column">
        <div class="flex flex-row gap-3 mb-3 w-full">
          <div class="w-full">
            <FloatLabel
              variant="on"
              class="w-full"
            >
              <InputMask
                id="snils"
                v-model="model.snils"
                mask="999-999-999 99"
                class="w-full"
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
              <label
                for="snils"
                class="text-sm"
              >
                СНИЛС</label
              >
            </FloatLabel>
          </div>
          <div class="w-full">
            <FloatLabel
              variant="on"
              class="w-full"
            >
              <Select
                id="course"
                v-model="model.course"
                :options="courseSelectOptions"
                option-label="label"
                option-value="value"
                class="w-full"
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
              <label
                for="course"
                class="text-sm"
              >
                Курс</label
              >
            </FloatLabel>
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
          <FloatLabel
            variant="on"
            class="w-full"
          >
            <InputMask
              id="pass-series"
              v-model="model.passport_series"
              mask="99 99"
              class="w-full"
              placeholder="Серия"
              :invalid="showValidation && !model.passport_series"
            />
            <label
              for="pass-series"
              class="text-sm"
            >
              Серия</label
            >
          </FloatLabel>
          <FloatLabel
            variant="on"
            class="w-full"
          >
            <InputMask
              id="pass-number"
              v-model="model.passport_number"
              mask="999999"
              class="w-full"
              :invalid="showValidation && !model.passport_number"
            />
            <label
              for="pass-number"
              class="text-sm"
            >
              Номер</label
            >
          </FloatLabel>
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
              input-id="Male"
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
              value="Female"
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

        <FloatLabel
          variant="on"
          class="flex w-full"
        >
          <DatePicker
            id="birtdate"
            v-model="model.birtdate"
            :invalid="showValidation && !model.birtdate"
            class="w-full"
          />
          <Message
            v-if="showValidation && !model.birthdate"
            severity="error"
            variant="simple"
            size="small"
          >
            Укажите дату рождения
          </Message>
          <label
            for="birtdate"
            class="text-sm"
          >
            Дата рождения</label
          >
        </FloatLabel>
        <FloatLabel variant="on">
          <Select
            id="birthplace"
            v-model="model.passport_birthplace"
            editable
            empty-message="Начните вводить адрес, чтобы увидеть варианты"
            empty-filter-message="Если в списке нет вашего варианта, ввдеите его в поле"
            :loading="isBirthPlaceLoading"
            class="w-full"
            :options="birthplaceOptions"
            :invalid="showValidation && !model.passport_birthplace"
            :pt="{
              label: {
                class: 'text-lg',
              },
            }"
            @update:model-value="onBirthPlaceHandler"
          />
          <Message
            v-if="showValidation && !model.passport_birthplace"
            severity="error"
            variant="simple"
            size="small"
          >
            Укажите место рождения
          </Message>

          <label
            for="birthplace"
            class="text-sm"
          >
            Место рождения
          </label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Select
            id="issued_by"
            v-model="model.passport_issued_by"
            filter
            :loading="isIssuedByLoading"
            class="w-full"
            :options="issuedByOptions"
            :invalid="showValidation && !model.passport_issued_by"
            @filter="onIssuedByInputHandler"
          />
          <Message
            v-if="showValidation && !model.passport_issued_by"
            severity="error"
            variant="simple"
            size="small"
          >
            Укажите кем выдан паспорт
          </Message>
          <label
            for="issued_by"
            class="text-sm"
          >
            Кем выдан
          </label>
        </FloatLabel>

        <div class="flex flex-row gap-3">
          <FloatLabel
            variant="on"
            class="flex w-full"
          >
            <InputMask
              id="issued_code"
              v-model="model.passport_issued_code"
              mask="999-999"
              class="w-full"
              :invalid="showValidation && !model.passport_issued_code"
            />
            <label
              for="issued_code"
              class="text-sm"
            >
              Код подразделения
            </label>
          </FloatLabel>
          <FloatLabel
            variant="on"
            class="flex w-full"
          >
            <DatePicker
              id="issued_date"
              v-model="model.passport_issued_date"
              class="w-full"
              :invalid="showValidation && !model.passport_issued_date"
            />
            <label
              for="issued_date"
              class="text-sm"
            >
              Дата выдачи
            </label>
          </FloatLabel>
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
  FloatLabel,
} from 'primevue';
import { useAuthStore } from '../../store/authStore';
import { computed, ref, watch } from 'vue';
import AuthService from '../../services/authService';
import Toast from '../../tools/toast';
import { debounce } from '../../tools/utils';
import GetGeoService from '../../services/getgeo';

const authStore = useAuthStore();
const toast = new Toast();
const model = defineModel({
  type: Object,
  default: () => {},
});

const prepareAuthData = (user_data) => {
  const data = { ...user_data };
  for (const [key, value] of Object.entries(data)) {
    if (value == 'None') data[key] = null;
  }
  data.passport_issued_date = new Date(data.passport_issued_date);
  data.birtdate = new Date(data.birtdate);

  return data;
};

const issuedByOptions = ref([authStore.user_data.passport_issued_by]);
const birthplaceOptions = ref([authStore.user_data.birthdate]);
const isIssuedByLoading = ref(false);
const isBirthPlaceLoading = ref(false);

model.value = prepareAuthData(authStore.user_data);

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

const onIssuedByInputHandler = debounce(async (value) => {
  if (value.value.lentght == 0) return;

  isIssuedByLoading.value = true;
  const response = await GetGeoService.passports(`${value.value}`, 40);
  isIssuedByLoading.value = false;

  let options = response.suggestions.reduce((acc, el) => {
    const label = el.value.toUpperCase();
    if (acc.indexOf(label) < 0) acc.push(label);
    return acc;
  }, []);

  issuedByOptions.value = options.slice(0, 19);
}, 500);

const onBirthPlaceHandler = debounce(async (value) => {
  if (value.lentght == 0) return;

  isBirthPlaceLoading.value = true;
  const response = await GetGeoService.address(value, 10);
  isBirthPlaceLoading.value = false;

  let options = response.suggestions.reduce((acc, el) => {
    acc.push(el.value);
    return acc;
  }, []);

  birthplaceOptions.value = options;
}, 500);

watch(
  () => model.value,
  (newValue) => {
    console.log('model.value.birtdate', model.value.birtdate);
    for (const [key, value] of Object.entries(newValue)) {
      if (value == 'None') newValue[key] = null;
    }
    newValue.passport_issued_date = new Date(newValue.passport_issued_date, 0, 1);
    newValue.birtdate = new Date(newValue.birtdate, 0, 1);
    authStore.setUserData(newValue);
  },
  {
    deep: true,
  }
);
</script>

<style scoped></style>
