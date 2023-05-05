<template>
  <v-footer app color="white" height="70px" elevation="3">
    <v-btn
      block
      large
      color="primary"
      class="font-weight-black text-body-1"
      @click="emits('click')"
    >
      {{ title }}
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
const emits = defineEmits<{ (e: "click"): void }>();
</script>
