<script setup>
import { ref, computed } from "vue"
import { Panel, Button, Toast, useToast} from "primevue";
import {useRouter} from "vue-router";
import Program from "../components/application/Program.vue";
import ApplicationHeader from "../components/application/ApplicationHeader.vue";
import ApplicationFooter from "../components/application/ApplicationFooter.vue";
import ApplicationFiles from "../components/application/ApplicationFiles.vue";
import ApplicationService from '../services/applicationService.js';

const applicationType = "transfer"
const toast = useToast();
const router = useRouter();

const formData = ref({
  header: {},
  programs: [{}, {}, {}],
  footer: {}
})

const prepareFormData = (formData) => {
    if (formData.type === 'reinstatement') return {
        ...formData,
        begin_year: formData.begin_year ? formData.begin_year.getFullYear() : formData.begin_year,
        end_year: formData.end_year ?  formData.begin_year.getFullYear() : formData.end_year,
    };

    return formData;
};

const application = computed({
  get: () => {
    return {
      type: applicationType,
      date: new Date().toISOString(),
      ...prepareFormData(formData.value.header),
      ...formData.value.footer, 
      programs: formData.value.programs,
    }
  },
})

const isChangeToBudget = computed({
  get: () => {
    if (applicationType !== 'change') return false
    const currentBase = formData.value.programs[0].base
    const newBases = [
      formData.value.programs[1].base, 
      formData.value.programs[2].base
    ]
    return newBases.includes('Бюджетная') && currentBase !== 'Бюджетная'
  }
})

const saveApplication = async () => {
  try {
    const response = await ApplicationService.saveApplication(application.value);
    toast.add({ severity: 'success', summary: 'Успех', detail: 'Заявление успешно сохранено', life: 3000 });
    await router.push({name: "SelfApplications"})
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'При сохранении заявления произошла ошибка', life: 3000 });
    // Handle the error, e.g., show an error message to the user
  }
};

</script>

<template>
  <div class="content">
    <div class="content flex justify-content-center m-auto mb-4 montserrat-font">
      <Panel class="application-panel">
        <template #header>
          <h3 v-if="applicationType === 'change'">Зявление на смену условий обучения</h3>
          <h3 v-else-if="applicationType === 'reinstatement'">Зявление на восстановление</h3>
          <h3 v-else-if="applicationType === 'transfer'">Зявление на перевод из другого ВУЗа</h3>
        </template>
        <div class="programs flex flex-column gap-4 mb-3">  
          <ApplicationHeader :type="applicationType" v-model="formData.header" />

          <Program v-model="formData.programs[0]" type="before" v-if="applicationType === 'reinstatement'" />
          <Program v-model="formData.programs[0]" type="current" v-else-if="applicationType === 'change'" />
          <Program v-model="formData.programs[0]" type="current" :anotherUniversity="true"
            v-else-if="applicationType === 'transfer'" />
          <Program v-model="formData.programs[1]" type="first" />
          <Program v-model="formData.programs[2]" type="second" />
          
          <ApplicationFooter :type="applicationType" v-model="formData.footer" />
          <ApplicationFiles :type="applicationType" :isTransferToBudget="isChangeToBudget"/>
        </div>
        <div class="flex flex-column w-full align-items-center">
          <Button label="Подать заявление" icon="pi pi-check" @click="saveApplication"/>
        </div>
      </Panel>
    </div>
  </div>
</template>

<style scoped>
.application-panel {
  width: 100%;
  max-width: 800px;
  min-width: 530px;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .application-panel :deep(.p-panel-content) {
    padding: 0.5rem;
  }
}
</style>