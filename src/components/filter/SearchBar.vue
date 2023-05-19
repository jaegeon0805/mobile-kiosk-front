<template>
  <v-text-field
    v-model="search"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    dense
    clearable
    outlined
    hide-details="auto"
    @click:clear="value = null"
    @keyup.enter="value = search"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useVModel } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    value: string | null;
  }>(),
  {
    placeholder: "검색어를 입력해주세요.",
  }
);

const emits = defineEmits<{
  (e: "input", v: string): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });

const search = ref("");
</script>

<style lang="scss" scoped>
.v-text-field {
  ::v-deep(.v-input__slot) {
    min-height: 36px !important;
    height: 36px;
  }

  max-width: 400px;
}
</style>
