<template>
  <v-dialog v-model="open" width="500px">
    <v-card class="d-flex flex-column overflow-hidden" height="300px">
      <v-card-text class="flex-grow-1 pa-0 d-flex justify-center align-center">
        <qrcode-vue :value="`${envs.FRONT_URL}kiosk/${value}`" size="200" />
      </v-card-text>
      <v-card-actions class="pa-0">
        <div class="dialog-button cancel-button" @click="open = false">
          취소
        </div>
        <div class="dialog-button confirm-button" @click="open = false">
          확인
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import "cropperjs/dist/cropper.css";
import { useVModels } from "@vueuse/core";
import QrcodeVue from "qrcode.vue";
import envs from "@/constants/envs";

const props = defineProps<{
  value: number;
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "update:open", v: boolean): void;
}>();

const { open } = useVModels(props, emits);
</script>

<style scoped>
.cropper img {
  width: 100%;
}

.dialog-button {
  display: inline-block;
  width: 50%;
  height: 65px;
  line-height: 65px;
  text-align: center;
  cursor: pointer;
}

.cancel-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 400;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background-color: #2196f3;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #1976d2;
}
</style>
