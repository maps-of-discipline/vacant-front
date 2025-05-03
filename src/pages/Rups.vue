<template>
  <div>
    <RupsPanel :source="aups.source" :target="aups.target"/>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import RupsPanel from "../components/rups/RupsPanel.vue";
import { onMounted, ref } from "vue";

const route = useRoute();
const aups = ref({
  source: {
    num: route.query.num1,
    sem: route.query.sem1,
  },
  target: {
    num: route.query.num2,
    sem: route.query.sem2,
  },
})
</script>

<style></style>
