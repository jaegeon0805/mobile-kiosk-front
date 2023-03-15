<template>
  <v-app>
    <component :is="currentLayout">
      <router-view />
    </component>
    <GlobalSnackbarAlert />
    <GlobalDialogConfirm />
  </v-app>
</template>

<script setup lang="ts">
import DefaultLayout from "@/views/layouts/DefaultLayout.vue";
import { computed } from "vue";

const layouts = {
  default: DefaultLayout,
};

const currentLayout = computed(() => layouts["default"]);
</script>
