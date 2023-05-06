<template>
  <v-card flat class="mt-3">
    <v-card-text class="d-flex justify-space-between align-center">
      <span class="font-weight-black text--primary" style="font-size: 18px">
        수량
      </span>
      <v-btn outlined color="grey" :disabled="!isStoreOpen || isMenuSoldOut">
        <v-icon :color="canMinus ? 'black' : 'grey'" @click="minus"
          >mdi-minus</v-icon
        >
        <span
          class="d-block font-weight-black text--primary"
          style="width: 50px"
          >{{ value }}</span
        >
        <v-icon :color="canPlus ? 'black' : 'grey'" @click="plus"
          >mdi-plus</v-icon
        >
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";

const { isStoreOpen, isMenuSoldOut } = storeToRefs(useKioskStore());

const props = withDefaults(
  defineProps<{
    value: number;
  }>(),
  { value: 1 }
);

const emits = defineEmits<{
  (e: "input", v: number): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });

const canMinus = computed(() => {
  return value.value > 1;
});

const canPlus = computed(() => {
  return value.value < 10;
});

function minus() {
  if (canMinus.value) {
    value.value -= 1;
  }
}

function plus() {
  if (canPlus.value) {
    value.value += 1;
  }
}
</script>
