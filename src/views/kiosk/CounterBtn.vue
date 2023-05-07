<template>
  <v-btn outlined color="grey" :disabled="disabled">
    <v-icon
      :color="canMinus ? 'black' : 'grey'"
      @click="canMinus ? emits('minus') : undefined"
      >mdi-minus</v-icon
    >
    <span class="d-block font-weight-black text--primary" style="width: 50px">
      {{ quantity }}
    </span>
    <v-icon
      :color="canPlus ? 'black' : 'grey'"
      @click="canPlus ? emits('plus') : undefined"
      >mdi-plus</v-icon
    >
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    quantity: number;
    max?: number;
    disabled?: boolean;
  }>(),
  {
    max: 10,
  }
);

const emits = defineEmits<{
  (e: "minus"): void;
  (e: "plus"): void;
}>();

const canMinus = computed(() => {
  return props.quantity > 1;
});

const canPlus = computed(() => {
  return props.quantity < props.max;
});
</script>
