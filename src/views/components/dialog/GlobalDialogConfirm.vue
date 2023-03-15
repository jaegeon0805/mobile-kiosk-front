<template>
  <div>
    <template v-for="(item, _index) in items" :key="_index">
      <DialogConfirm
        :content="item.content"
        :width="item.width"
        :confirm-button-title="item.confirmButtonTitle"
        :cancel-button-title="item.cancelButtonTitle"
        @confirm="okConfirm"
        @cancel="closeConfirm"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import DialogConfirm from "@/views/components/dialog/DialogConfirm.vue";
import { useConfirmStore } from "@/stores/confirm";

const { items } = storeToRefs(useConfirmStore());
const { okConfirm, closeConfirm } = useConfirmStore();
</script>
