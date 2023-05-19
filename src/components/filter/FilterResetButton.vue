<template>
  <v-row no-gutters>
    <v-col cols="1">
      <v-btn text class="px-2" @click="emits('reset')"> 필터 초기화 </v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const emits = defineEmits<{
  (e: "reset"): void;
}>();
</script>
