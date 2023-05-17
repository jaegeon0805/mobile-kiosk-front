<template>
  <v-container class="pa-0">
    <slot />
    <v-overlay v-show="loading" style="z-index: 1000" color="transparent">
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useSpinnerStore } from "@/stores/loadingSpinner";
import { useCustomerSocketStore } from "@/stores/customerWebSocket";
import { useKioskStore } from "@/stores/kiosk";

const { loading } = storeToRefs(useSpinnerStore());
const { customerUuid } = storeToRefs(useKioskStore());
const { initializeWebSocket, webSocketDisconnect } = useCustomerSocketStore();

onMounted(async () => {
  initializeWebSocket(customerUuid.value);
});

onUnmounted(() => {
  webSocketDisconnect();
});
</script>
