<template>
  <v-snackbar v-model="openAlert" :timeout="item.timer" top light class="mt-4">
    <div class="d-flex align-center">
      <v-icon :color="item.color">{{ item.icon }}</v-icon>
      <span class="mx-2 alert-message" v-html="item.message" />
      <v-spacer />
      <span
        class="alert-close"
        :style="{ color: item.color }"
        @click="toastClose"
      >
        닫기
      </span>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";
import { storeToRefs } from "pinia";

const { toastClose } = useAlertStore();
const { item, openAlert } = storeToRefs(useAlertStore());
</script>

<style scoped>
.v-application .v-snack .v-snack__content i {
  font-size: 20px !important;
}

.alert-message {
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0;
  text-align: left;
}

.alert-close {
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0;
  text-align: left;
  cursor: pointer;
}
</style>
