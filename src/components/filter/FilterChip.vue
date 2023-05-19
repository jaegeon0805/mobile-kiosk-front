<template>
  <v-chip
    :input-value="value"
    outlined
    class="px-4 mb-1"
    label
    style="cursor: pointer"
    @click="value = !value"
  >
    <span class="d-inline-flex align-center">
      <v-icon left>mdi-tune</v-icon>
      필터
    </span>
  </v-chip>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  value: boolean;
}>();

const emits = defineEmits<{
  (e: "input", v: boolean): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });
</script>
