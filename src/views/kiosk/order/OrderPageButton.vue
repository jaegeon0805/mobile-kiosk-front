<template>
  <v-slide-x-reverse-transition>
    <v-btn
      v-show="showButton"
      color="pink"
      dark
      fixed
      fab
      large
      style="z-index: 1000; right: 10px"
      :style="`bottom: ${bottom}`"
      @click="routerPush(`/kiosk/${currentStore.id}/orders`)"
    >
      <span class="font-weight-black text-caption">주문 목록</span>
    </v-btn>
  </v-slide-x-reverse-transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";
import { routerPush } from "@/utils/commands";

defineProps<{
  bottom: string;
}>();

const { orders, currentStore } = storeToRefs(useKioskStore());

const showButton = computed(() => {
  return orders.value.length > 0;
});
</script>
