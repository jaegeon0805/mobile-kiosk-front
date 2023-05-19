<template>
  <div class="d-flex align-center pr-4">
    <v-card-title>{{ title }}</v-card-title>
    <v-spacer />
    <v-btn outlined class="px-2 font-weight-black" @click="emits('click')">
      <v-icon v-if="buttonIcon">{{ buttonIcon }}</v-icon>
      <span v-else>{{ buttonTitle }}</span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    buttonTitle?: string;
    buttonIcon?: string;
  }>(),
  { buttonTitle: "생성" }
);

const emits = defineEmits<{
  (e: "click"): void;
}>();
</script>
