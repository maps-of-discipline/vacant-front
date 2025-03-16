<script setup>
import {ref} from "vue"
import { Panel, InputText, Button, RadioButton, DatePicker} from 'primevue'

const sex = ref("")
</script>

<template>
  <div class="content flex w-6 m-auto mb-4 mons montserrat-font">
    <Panel class="w-10 m-auto">
      <template #header>
        <h2>Регистрация</h2>
      </template>
      <Panel class="flex flex-column mb-4" header="Данные студента">
        <div class="flex flex-column">
          <InputText class="mb-3" placeholder="Email"/>
          <InputText class="mb-3" placeholder="ФИО"/>
          <InputText class="mb-3" placeholder="Телефон"/>
          <InputText class="mb-3" placeholder="СНИЛС"/>
          <InputText class="mb-3" placeholder="Курс"/>
        </div>
      </Panel>
      <Panel header="Паспорт" class="mb-4">
        <div class="flex flex-column gap-3">
          <div class="flex flex-row gap-3">
            <InputText class='w-full' placeholder="Серия"/>
            <InputText class='w-full' placeholder="Номер"/>
          </div>

          <Panel header="Пол">
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2">
                <RadioButton v-model="sex" inputId="male" name="sex" value="male" />
                <label for="male">Муж.</label>
              </div>
              <div class="flex items-center gap-2">
                <RadioButton v-model="sex" inputId=female name="sex" value="female" />
                <label for="female">Жен.</label>
              </div>
            </div>
          </Panel>

          <DatePicker placeholder="Дата рождения"/>
          <InputText placeholder="Место рождения"/>
          <InputText placeholder="Кем выдан"/>

          <div class="flex flex-row gap-3">
            <InputText class='w-full' placeholder="Код подразделения"/>
            <DatePicker class='w-full' placeholder="Дата выдачи"/>
          </div>
        </div>
      </Panel>
      <div class="button-group flex justify-content-center">
        <Button label="Зарегистрироваться"/>
      </div>
    </Panel>
  </div>

</template>

<style scoped>
.montserrat-font {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>