<template>
  <v-card flat class="mt-3">
    <v-card-text class="d-flex justify-space-between align-center">
      <span class="font-weight-black text--primary" style="font-size: 18px">
        수량
      </span>
      <CounterBtn
        :quantity="value"
        :disabled="!isStoreOpen || isMenuSoldOut"
        @minus="value -= 1"
        @plus="value += 1"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";
import CounterBtn from "@/views/kiosk/CounterBtn.vue";

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
</script>
