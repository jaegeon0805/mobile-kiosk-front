<template>
  <v-snackbar
    v-model="openAlert"
    :timeout="item.timer"
    :color="item.color"
    top
    light
    text
    class="mt-4"
  >
    <div class="pre-wrap font-weight-medium" v-html="item.message" />
    <template #action>
      <v-icon :color="item.color" @click="toastClose"> mdi-close </v-icon>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";
import { storeToRefs } from "pinia";

const { toastClose } = useAlertStore();
const { item, openAlert } = storeToRefs(useAlertStore());
</script>
