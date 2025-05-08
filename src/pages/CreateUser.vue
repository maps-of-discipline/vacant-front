<template>
  <div class="content flex montserrat-font">
    <Panel class="sign-up-form m-auto">
      <template #header>
        <h2>Регистрация</h2>
      </template>
      <Panel class="flex flex-column mb-4" header="Данные студента">
        <div class="flex flex-column">
          <div class="mb-3 w-full">
            <InputText
              class="w-full"
              v-model="fullname"
              placeholder="ФИО"
              :invalid="showValidation && !!fullNameErrorMessage"
            />
            <Message
              v-if="showValidation && fullNameErrorMessage"
              severity="error"
              variant="simple"
              size="small"
              >{{ fullNameErrorMessage }}</Message
            >
          </div>

          <div class="flex flex-row mb-3 gap-3 mb-3 w-full">
            <div class="w-full">
              <InputText
                class="w-full"
                v-model="user.email"
                placeholder="Email"
                :invalid="showValidation && !!emailErrorMessage"
              />
              <Message
                v-if="showValidation && emailErrorMessage"
                severity="error"
                variant="simple"
                size="small"
                >{{ emailErrorMessage }}</Message
              >
            </div>
            <div class="w-full">
              <InputMask
                mask="+7 (999) 999 99 99"
                class="w-full h-fit"
                v-model="user.phone"
                placeholder="Номер мобльного телефона"
                :invalid="showValidation && !user.phone"
              />
              <Message
                v-if="showValidation && !user.phone"
                severity="error"
                variant="simple"
                size="small"
                >Поле должно быть заполнено</Message
              >
            </div>
          </div>
          <div class="flex flex-row gap-3 mb-3 w-full">
            <div class="w-full">
              <InputMask
                mask="999-999-999 99"
                class="w-full"
                v-model="user.snils"
                placeholder="СНИЛС"
                :invalid="showValidation && !user.snils"
              />
              <Message
                v-if="showValidation && !user.snils"
                severity="error"
                variant="simple"
                size="small"
                >Поле должно быть заполнено</Message
              >
            </div>
            <div class="w-full">
              <Select
                :options="courseSelectOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                v-model="user.course"
                placeholder="Курс"
                :invalid="showValidation && !user.course"
              />
              <Message
                v-if="showValidation && !user.course"
                severity="error"
                variant="simple"
                size="small"
                >Поле должно быть заполнено</Message
              >
            </div>
          </div>
        </div>
      </Panel>
      <Panel header="Паспорт" class="mb-4">
        <div class="flex flex-column gap-3">
          <div class="flex flex-row gap-3">
            <InputMask
              mask="99 99"
              class="w-full"
              placeholder="Серия"
              v-model="user.passport_series"
              :invalid="showValidation && !user.passport_series"
            />
            <InputMask
              mask="999999"
              class="w-full"
              placeholder="Номер"
              v-model="user.passport_number"
              :invalid="showValidation && !user.passport_number"
            />
          </div>
          <Message
            v-if="
              showValidation && (!user.passport_series || !user.passport_number)
            "
            severity="error"
            variant="simple"
            size="small"
            >Серия и номер паспорта обязательны</Message
          >

          <div class="flex flex-wrap gap-4">
            <label class="font-semibold">Пол:</label>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="user.sex"
                inputId="male"
                name="sex"
                value="male"
              />
              <label for="male">Муж.</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="user.sex"
                inputId="female"
                name="sex"
                value="female"
              />
              <label for="female">Жен.</label>
            </div>
          </div>
          <Message
            v-if="showValidation && !user.sex"
            severity="error"
            variant="simple"
            size="small"
            >Укажите пол
          </Message>

          <DatePicker
            placeholder="Дата рождения"
            v-model="user.birthdate"
            :invalid="showValidation && !user.birthdate"
          />
          <Message
            v-if="showValidation && !user.birthdate"
            severity="error"
            variant="simple"
            size="small"
            >Укажите дату рождения</Message
          >

          <InputText
            placeholder="Место рождения"
            v-model="user.passport_birthplace"
            :invalid="showValidation && !user.passport_birthplace"
          />
          <Message
            v-if="showValidation && !user.passport_birthplace"
            severity="error"
            variant="simple"
            size="small"
          >
            Укажите место рождения</Message
          >

          <InputText
            placeholder="Кем выдан"
            v-model="user.passport_issued_by"
            :invalid="showValidation && !user.passport_issued_by"
          />
          <Message
            v-if="showValidation && !user.passport_issued_by"
            severity="error"
            variant="simple"
            size="small"
          >
            Укажите кем выдан паспорт</Message
          >

          <div class="flex flex-row gap-3">
            <InputMask
              mask="999-999"
              class="w-full"
              placeholder="Код подразделения"
              v-model="user.passport_issued_code"
              :invalid="showValidation && !user.passport_issued_code"
            />
            <DatePicker
              class="w-full"
              placeholder="Дата выдачи"
              v-model="user.passport_issued_date"
              :invalid="showValidation && !user.passport_issued_date"
            />
          </div>
          <Message
            v-if="
              showValidation &&
              (!user.passport_issued_code || !user.passport_issued_date)
            "
            severity="error"
            variant="simple"
            size="small"
            >Укажите код подразделения и дату выдачи</Message
          >
        </div>
      </Panel>
      <div class="button-group flex justify-content-center">
        <Button label="Зарегистрироваться" @click="onSubmit" />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from "vue";
import {
  Panel,
  InputText,
  Button,
  RadioButton,
  DatePicker,
  InputMask,
  Select,
  Message,
} from "primevue";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";
import { UserAlreadyExistsError } from "../exceptions/user";
import AuthService from "../services/authService";
import Toast from "../tools/toast";

const authStore = useAuthStore();
const router = useRouter();

const fullname = ref("");
const showValidation = ref(false);
const toast = new Toast();

const courseSelectOptions = [
  { label: "1 курс", value: 1 },
  { label: "2 курс", value: 2 },
  { label: "3 курс", value: 3 },
  { label: "4 курс", value: 4 },
  { label: "5 курс", value: 5 },
];

const user = reactive({
  email: null,
  name: null,
  surname: null,
  patronymic: null,
  phone: null,
  snils: null,
  course: null,
  sex: null,
  birthdate: null,

  passport_series: null,
  passport_birthplace: null,
  passport_issued_by: null,
  passport_issued_code: null,
  passport_issued_date: null,
});

watch(
  () => fullname.value,
  (newValue) => {
    const [surname, name, patronymic] = newValue.trim().split(" ");
    user.surname = surname;
    user.name = name;
    user.patronymic = patronymic;
  },
);

const emailErrorMessage = computed(() => {
  if (!user.email) {
    return "Поле должно быть заполнено";
  }
  if (!/^\S+@\S+\.\S+$/.test(user.email)) {
    return "Введите действительный Email";
  }
  return "";
});

const fullNameErrorMessage = computed(() => {
  if (!fullname.value) {
    return "Поле должно быть заполнено";
  }

  if (fullname.value.trim().split(" ").length !== 3) {
    return "ФИО должно содержать фамилию, имя и отчество, разделенные пробелами.";
  }
  return "";
});

const isValid = computed(() => {
  // Basic fields validation
  if (!user.name || !user.surname || !user.patronymic) return false;
  if (!user.email || emailErrorMessage.value) return false;
  if (!user.phone || !user.snils || !user.course || !user.sex) return false;

  // Passport data validation

  if (!user.passport_series || !user.passport_number) return false;
  if (!user.birthdate || !user.passport_birthplace) return false;
  if (
    !user.passport_issued_by ||
    !user.passport_issued_code ||
    !user.passport_issued_date
  )
    return false;

  return true;
});

const onSubmit = async () => {
  showValidation.value = true;

  if (isValid.value) {
    try {
      await authStore.signUp(user)
      toast.success("Пользователь успешно зарегистрирован");
      AuthService.redirectToLoginViaEmail()
    } catch (error) {
      console.error('asdfasdfasdf', error)
      if (error instanceof UserAlreadyExistsError) {
        toast.warn("Пользователь с такой электронной почтой уже существует.");
      } else {
        toast.error("Не удалось зарегистрировать пользователя");
      }
    }
  } else {
    toast.warn("Пожалуйста, заполните все необходимые поля");
  }
};
</script>

<style scoped>
.sign-up-form {
  width: 100%;
  min-width: 500px;
  max-width: 700px;
}

.montserrat-font {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
