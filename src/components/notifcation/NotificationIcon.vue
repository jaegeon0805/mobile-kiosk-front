<template>
  <v-badge :content="notificationCounter" :value="notificationCounter" overlap>
    <v-icon @click="value = !value">mdi-bell</v-icon>
  </v-badge>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/stores/notification";

const { notificationCounter } = storeToRefs(useNotificationStore());

const props = defineProps<{ value: boolean }>();

const emits = defineEmits<{
  (e: "input", v: boolean): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });
</script>
