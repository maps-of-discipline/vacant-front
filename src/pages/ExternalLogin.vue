<template>
  <div class="flex h-screen align-items-center justify-content-center surface-50">
    <Panel class="w-full md:w-5 lg:w-3 border-round-2xl shadow-4 flex flex-column p-0 montserrat-font mx-3 md:mx-0">
      <template #header>
        <div class="text-center w-full pt-4 pb-3 flex flex-column align-items-center">
          <div class="mb-3">
            <img 
              :src="'/logo-white.png'" 
              alt="Московский Политех" 
              height="70" 
              class="mb-3"
            />
          </div>
          <h2 class="text-2xl font-bold m-0 text-900">Вход в систему</h2>
        </div>
      </template>
      
      <div class="px-4 py-5">
        <h4 class="text-lg text-600 text-center mb-5 mt-0 font-medium">Вход для студентов других ВУЗов</h4>
        
        <div class="flex flex-column gap-3 mb-4">
          <div class="w-full">
            <FloatLabel variant="on">
                <InputText 
                    id="email"
                    class="w-full p-inputtext"
                    size="large" 
                    v-model="credentials.email" 
                    :class="{'p-invalid': showValidation && !credentials.email}"
                />
                <label for="email" class="text-md">Email</label>
            </FloatLabel> 
            <Message v-if="showValidation && !credentials.email" severity="error" size="small" variant="simple">
              Введите email
            </Message>
        </div>  
        </div>
        
        <div class="flex flex-column gap-3 mb-2">
          <Button 
            label="Войти" 
            @click="login" 
            :loading="loading"
            class="p-3 font-medium text-base"
            icon="pi pi-sign-in"
            iconPos="right"
            raised
          />
          
          <div class="text-center mt-2">
            <router-link to="/external/sign-up" class="text-primary font-medium text-sm">Регистрация</router-link>
            <span class="text-500 px-2">|</span>
            <router-link to="/login" class="text-primary font-medium text-sm">Назад</router-link>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { Panel, InputText, Message, Button, FloatLabel} from 'primevue'
 
const router = useRouter();
const toast = useToast();

const credentials = reactive({
  email: "",
});

const showValidation = ref(false);
const loading = ref(false);

const login = async () => {
  showValidation.value = true;
  
  if (!credentials.email) {
    return;
  }
  
  try {
    loading.value = true;
    // Replace this with your actual login API call
    // await authService.loginWithEmail(credentials.email, credentials.password);
    
    console.log('Login attempt with:', credentials.email);
    
    setTimeout(() => {
      loading.value = false;
      toast.add({
        severity: 'success',
        summary: 'Успешный вход',
        detail: 'Добро пожаловать в систему',
        life: 3000
      });
      
      // Navigate to home or dashboard page after successful login
      router.push('/');
    }, 1000);
    
  } catch (error) {
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Ошибка входа',
      detail: error.message || 'Неверные данные входа',
      life: 3000
    });
  }
};
</script>

<style scoped>
.montserrat-font {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

.logo-light-mode {
  filter: invert(1);
}
</style>