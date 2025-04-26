<template>
  <div>
    <span v-if='props.message' class="pi pi-question-circle" v-tooltip.bottom="tooltipMessage"/>    
  </div>
</template>


<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
  },
  side: {
    type: String,
    default: 'left'
  }, 
  size: {
    type: String,
    default: 'normal'
  }
})

const tooltipMessage = computed(() => {
  return {
    value: props.message,
    escape: false,
    pt: {
      root: {
        class: {
          "c-tooltip-small": props.size === 'small',
          "c-tooltip-normal": props.size === 'normal',
          "c-tooltip-large": props.size === 'large',
        }
      }
    }
  }
})

</script>

<style>
.c-tooltip-large {
  max-width: 500px !important; /* Adjust this value as needed */
  width: max-content !important;
}

.c-tooltip-normal {
  max-width: 300px !important; /* Adjust this value as needed */
  width: max-content !important;
}

.c-tooltip-small {
  max-width: 100px !important; /* Adjust this value as needed */
  width: max-content !important;
}

.pi-question-circle {
  cursor: pointer;
}
</style>
