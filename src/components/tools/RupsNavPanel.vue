<template>
  <div>
    <Panel header="Расхождения при смене учебного плана">
      <Fluid>
        <div class="flex gap-2 w-full">
          <Button
            label="Приоритет 1"
            @click="redirectToRups(1)"
          />
          <Button
            label="Приоритет 2"
            @click="redirectToRups(2)"
          />
        </div>
      </Fluid>
    </Panel>
  </div>
</template>

<script setup>
import { Panel, Button, Fluid } from 'primevue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const redirectToRups = (profileNum) => {
  const source = props.application.programs[0];
  const target = props.application.programs[profileNum];
  router.push({
    name: 'Rups',
    query: {
      num1: source.profile,
      sem1: source.sem_num,
      num2: target.profile,
      sem2: target.sem_num,
    },
  });
};
</script>

<style></style>
