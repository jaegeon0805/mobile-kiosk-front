<template>
  <div>
    <v-dialog :width="width" :value="true">
      <v-card height="250px" class="d-flex flex-column overflow-hidden">
        <v-card-text
          class="flex-grow-1 pa-0 d-flex justify-center align-center"
        >
          <!-- eslint-disable vue/no-v-html -->
          <span class="dialog-content" v-html="content" />
        </v-card-text>

        <v-card-actions class="flex-grow-0 pa-0">
          <div class="dialog-button cancel-button" @click="emits('cancel')">
            {{ cancelButtonTitle }}
          </div>
          <div class="dialog-button confirm-button" @click="emits('confirm')">
            {{ confirmButtonTitle }}
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    content?: string;
    cancelButtonTitle?: string;
    confirmButtonTitle?: string;
    width?: string;
  }>(),
  {
    content: "Content",
    cancelButtonTitle: "취소",
    confirmButtonTitle: "확인",
    width: "450px",
  }
);

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();
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
  border-width: 1px 1px 0 0;
  border-style: solid;
  border-color: #0000001a;
  font-size: 16px;
  font-weight: 400;
}

.confirm-button {
  border-top: 1px solid #0000001a;
  font-size: 16px;
  font-weight: 700;
  color: #289185;
}
</style>
