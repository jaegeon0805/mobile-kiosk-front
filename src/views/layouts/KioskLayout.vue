<template>
  <v-container class="pa-0">
    <slot />
    <v-overlay v-show="loading" style="z-index: 1000" color="transparent">
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSpinnerStore } from "@/stores/loadingSpinner";

const { loading } = storeToRefs(useSpinnerStore());
</script>
