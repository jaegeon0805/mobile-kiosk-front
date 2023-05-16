<template>
  <v-navigation-drawer
    v-model="value"
    app
    temporary
    right
    fixed
    color="#f2f5f8"
  >
    <v-card color="white" flat style="position: sticky; top: 0; z-index: 1000">
      <v-icon class="ma-4" @click="value = false">mdi-arrow-right-thick</v-icon>
      <v-divider />
    </v-card>

    <NotificationCard
      v-for="notification in notifications"
      :key="notification.id"
      :value="notification"
      @close-notification="value = false"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/stores/notification";
import NotificationCard from "@/components/notifcation/NotificationCard.vue";

const { notifications } = storeToRefs(useNotificationStore());

const props = defineProps<{ value: boolean }>();

const emits = defineEmits<{
  (e: "input", v: boolean): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });
</script>
