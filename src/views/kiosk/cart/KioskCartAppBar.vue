<template>
  <v-app-bar app fixed elevation="0" color="white" height="50px" width="100%">
    <v-icon
      class="mr-2"
      color="black"
      @click="routerPush(`/kiosk/${currentStore.id}`)"
    >
      mdi-arrow-left
    </v-icon>
    <v-spacer />
    <span class="text-subtitle-1 font-weight-bold"> 장바구니 </span>
    <v-spacer />
    <span class="text-subtitle-2 text--secondary" @click="clear">
      전체삭제
    </span>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import { routerPush } from "@/utils/commands";

const { currentStore, isNotEmptyCart } = storeToRefs(useKioskStore());
const { clearCart } = useKioskStore();

function clear() {
  if (isNotEmptyCart.value) {
    const result = confirm("장바구니를 모두 비우시겠습니까?");

    if (result) {
      clearCart();
    }
  }
}
</script>
