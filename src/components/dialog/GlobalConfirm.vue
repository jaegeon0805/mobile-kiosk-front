<template>
  <v-dialog v-model="openConfirm" :width="item.width">
    <v-card class="d-flex flex-column overflow-hidden" height="250px">
      <v-card-text class="flex-grow-1 pa-0 d-flex justify-center align-center">
        <span class="dialog-content" v-html="item.content" />
      </v-card-text>

      <v-card-actions class="pa-0">
        <div class="dialog-button cancel-button" @click="closeConfirm">
          {{ item.cancelButtonTitle }}
        </div>
        <div class="dialog-button confirm-button" @click="okConfirm">
          {{ item.confirmButtonTitle }}
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useConfirmStore } from "@/stores/confirm";
import { storeToRefs } from "pinia";

const { okConfirm, closeConfirm } = useConfirmStore();
const { openConfirm, item } = storeToRefs(useConfirmStore());
</script>

<style scoped>
.dialog-content {
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
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
