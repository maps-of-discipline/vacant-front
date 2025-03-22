<template>
  <div class="content flex montserrat-font">
    <Panel class="sign-up-form m-auto">
      <template #header>
        <h2>Регистрация</h2>
      </template>
      <Panel class="flex flex-column mb-4" header="Данные студента">
        <div class="flex flex-column">
          <div class="mb-3 w-full">
            <InputText class="w-full" v-model="fullname" placeholder="ФИО" :invalid="showValidation && fullNameErrorMessage"/>
            <Message v-if="showValidation && fullNameErrorMessage" severity="error" variant="simple" size="small">{{
              fullNameErrorMessage }}</Message>
          </div>

          <div class="flex flex-row mb-3 gap-3 mb-3 w-full">
            <div class="w-full">
              <InputText class="w-full" v-model="user.email" placeholder="Email"
                :invalid="showValidation && !!emailErrorMessage" />
              <Message v-if="showValidation && emailErrorMessage" severity="error" variant="simple" size="small">{{
                emailErrorMessage }}</Message>
            </div>
            <div class="w-full">
              <InputMask 
                mask="+7 (999) 999 99 99" 
                class="w-full h-fit" 
                v-model="user.phone"
                placeholder="Номер мобльного телефона" 
                :invalid="showValidation && !user.phone"
              />
              <Message v-if="showValidation && !user.phone" severity="error" variant="simple" size="small"
              >Поле должно быть заполнено</Message>
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
              <Message v-if="showValidation && !user.snils" severity="error" variant="simple" size="small"
              >Поле должно быть заполнено</Message>
            </div>
            <div class="w-full">
              <Select :options="courseSelectOptions" optionLabel='label' optionValue='value' class="w-full"
              v-model="user.course" placeholder="Курс" :invalid="showValidation && !user.course"/>
              <Message v-if="showValidation && !user.course" severity="error" variant="simple" size="small"
              >Поле должно быть заполнено</Message>
            </div>
            
          </div>
        </div>
      </Panel>
      <Panel header="Паспорт" class="mb-4">
        <div class="flex flex-column gap-3">
          <div class="flex flex-row gap-3">
            <InputMask mask="99 99" class="w-full" placeholder="Серия" 
              v-model="user.passport_data.series" 
              :invalid="showValidation && !user.passport_data.series"/>
            <InputMask mask="999999" class="w-full" placeholder="Номер" 
              v-model="user.passport_data.number"
              :invalid="showValidation && !user.passport_data.number"/>
          </div>
          <Message v-if="showValidation && (!user.passport_data.series || !user.passport_data.number)" 
            severity="error" variant="simple" size="small">Серия и номер паспорта обязательны</Message>

          <div class="flex flex-wrap gap-4">
            <label class="font-semibold">Пол:</label>
            <div class="flex items-center gap-2">
              <RadioButton v-model="user.sex" inputId="male" name="sex" value="male" />
              <label for="male">Муж.</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="user.sex" inputId="female" name="sex" value="female" />
              <label for="female">Жен.</label>
            </div>
          </div>
          <Message v-if="showValidation && !user.sex" severity="error" variant="simple" size="small">Укажите пол</Message>

          <DatePicker placeholder="Дата рождения" v-model="user.passport_data.birthdate" 
            :invalid="showValidation && !user.passport_data.birthdate"/>
          <Message v-if="showValidation && !user.passport_data.birthdate" severity="error" variant="simple" size="small">Укажите дату рождения</Message>

          <InputText placeholder="Место рождения" v-model="user.passport_data.birthplace"
            :invalid="showValidation && !user.passport_data.birthplace"/>
          <Message v-if="showValidation && !user.passport_data.birthplace" severity="error" variant="simple" size="small">Укажите место рождения</Message>

          <InputText placeholder="Кем выдан" v-model="user.passport_data.issued_by"
            :invalid="showValidation && !user.passport_data.issued_by"/>
          <Message v-if="showValidation && !user.passport_data.issued_by" severity="error" variant="simple" size="small">Укажите кем выдан паспорт</Message>

          <div class="flex flex-row gap-3">
            <InputMask mask="999-999" class="w-full" placeholder="Код подразделения" 
              v-model="user.passport_data.issued_code"
              :invalid="showValidation && !user.passport_data.issued_code"/>
            <DatePicker class="w-full" placeholder="Дата выдачи" 
              v-model="user.passport_data.issued_date"
              :invalid="showValidation && !user.passport_data.issued_date"/>
          </div>
          <Message v-if="showValidation && (!user.passport_data.issued_code || !user.passport_data.issued_date)" 
            severity="error" variant="simple" size="small">Укажите код подразделения и дату выдачи</Message>
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
  Message
} from "primevue";
import { useToast } from "primevue";

const fullname = ref('');
const showValidation = ref(false);
const toast = useToast();

const courseSelectOptions = [
  { label: "1 курс", value: 1 },
  { label: "2 курс", value: 2 },
  { label: "3 курс", value: 3 },
  { label: "4 курс", value: 4 },
  { label: "5 курс", value: 5 },
]

const user = reactive({
  email: null,
  name: null,
  surname: null,
  patronymic: null,
  phone: null,
  snils: null,
  course: null,
  sex: null,
  passport_data: {
    series: null,
    sex: null,
    birthdate: null,
    birthplace: null,
    issued_by: null,
    issued_code: null,
    issued_date: null,
  },
});


watch(() => fullname.value, (newValue) => {
  const [surname, name, patronymic] = newValue.trim().split(" ");
  user.surname = surname;
  user.name = name;
  user.patronymic = patronymic;
});


const emailErrorMessage = computed(() => {
  if (!user.email) {
    return "Email is required.";
  }
  if (!/^\S+@\S+\.\S+$/.test(user.email)) {
    return "Email is invalid.";
  }
  return "";
})

const fullNameErrorMessage = computed(() => {
  if (!fullname.value) {
    return "Full name is required.";
  }

  if (fullname.value.trim().split(" ").length !== 3) {
    return "Full name must include surname, name, and patronymic.";
  }
  return "";
})


const isValid = computed(() => {
  // Basic fields validation
  if (!user.name || !user.surname || !user.patronymic) return false;
  if (!user.email || emailErrorMessage.value) return false;
  if (!user.phone || !user.snils || !user.course || !user.sex) return false;
  
  // Passport data validation
  const passport = user.passport_data;
  if (!passport.series || !passport.number) return false;
  if (!passport.birthdate || !passport.birthplace) return false;
  if (!passport.issued_by || !passport.issued_code || !passport.issued_date) return false;
  
  return true;
});

const onSubmit = () => {
  showValidation.value = true;
  
  if (isValid.value) {
    // Proceed with form submission
    // TODO: save user using api
    console.log('Form is valid, submitting...', user);
    // Here you would call your API to register the user
  } else {
    toast.add({
      severity: "warn",
      summary: "Ошибка",
      detail: "Пожалуйста, заполните все необходимые поля",
      life: 3000,
    });
  }
}

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
