<template>
  <div class="content flex montserrat-font">
    <Panel class="sign-up-form m-auto">
      <template #header>
        <h2>Регистрация</h2>
      </template>
      <Panel
        class="flex flex-column mb-4"
        header="Данные студента"
      >
        <div class="flex flex-column">
          <div class="mb-3 w-full">
            <InputText
              v-model="fullname"
              class="w-full"
              placeholder="ФИО"
              :invalid="showValidation && !!fullNameErrorMessage"
            />
            <Message
              v-if="showValidation && fullNameErrorMessage"
              severity="error"
              variant="simple"
              size="small"
            >
              {{ fullNameErrorMessage }}
            </Message>
          </div>

          <div class="flex flex-row mb-3 gap-3 mb-3 w-full">
            <div class="w-full">
              <InputText
                v-model="user.email"
                class="w-full"
                placeholder="Email"
                :invalid="showValidation && !!emailErrorMessage"
              />
              <Message
                v-if="showValidation && emailErrorMessage"
                severity="error"
                variant="simple"
                size="small"
              >
                {{ emailErrorMessage }}
              </Message>
            </div>
            <div class="w-full">
              <InputMask
                v-model="user.phone"
                mask="+7 (999) 999 99 99"
                class="w-full h-fit"
                placeholder="Номер мобльного телефона"
                :invalid="showValidation && !user.phone"
              />
              <Message
                v-if="showValidation && !user.phone"
                severity="error"
                variant="simple"
                size="small"
              >
                Поле должно быть заполнено
              </Message>
            </div>
          </div>
        </div>
      </Panel>
      <div class="button-group flex justify-content-center">
        <Button
          label="Зарегистрироваться"
          @click="onSubmit"
        />
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';
import { Panel, InputText, Button, InputMask, Message } from 'primevue';
import { useAuthStore } from '../store/authStore';
import { UserAlreadyExistsError } from '../exceptions/user';
import AuthService from '../services/authService';
import Toast from '../tools/toast';

const authStore = useAuthStore();

const fullname = ref('');
const showValidation = ref(false);
const toast = new Toast();

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
    const [surname, name, patronymic] = newValue.trim().split(' ');
    user.surname = surname;
    user.name = name;
    user.patronymic = patronymic;
  }
);

const emailErrorMessage = computed(() => {
  if (!user.email) {
    return 'Поле должно быть заполнено';
  }
  if (!/^\S+@\S+\.\S+$/.test(user.email)) {
    return 'Введите действительный Email';
  }
  return '';
});

const fullNameErrorMessage = computed(() => {
  if (!fullname.value) {
    return 'Поле должно быть заполнено';
  }

  if (fullname.value.trim().split(' ').length !== 3) {
    return 'ФИО должно содержать фамилию, имя и отчество, разделенные пробелами.';
  }
  return '';
});

const isValid = computed(() => {
  // Basic fields validation
  if (!user.name || !user.surname || !user.patronymic) return false;
  if (!user.email || emailErrorMessage.value) return false;
  if (!user.phone || !user.snils || !user.course || !user.sex) return false;

  // Passport data validation

  if (!user.passport_series || !user.passport_number) return false;
  if (!user.birthdate || !user.passport_birthplace) return false;
  if (!user.passport_issued_by || !user.passport_issued_code || !user.passport_issued_date)
    return false;

  return true;
});

const onSubmit = async () => {
  showValidation.value = true;

  if (isValid.value) {
    try {
      await authStore.signUp(user);
      toast.success('Пользователь успешно зарегистрирован');
      AuthService.redirectToLoginViaEmail();
    } catch (error) {
      console.error('asdfasdfasdf', error);
      if (error instanceof UserAlreadyExistsError) {
        toast.warn('Пользователь с такой электронной почтой уже существует.');
      } else {
        toast.error('Не удалось зарегистрировать пользователя');
      }
    }
  } else {
    toast.warn('Пожалуйста, заполните все необходимые поля');
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
  font-family: 'Montserrat', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
