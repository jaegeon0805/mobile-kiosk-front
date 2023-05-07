<template>
  <v-badge :content="cartItemCount" :value="cartItemCount" overlap>
    <v-icon :color="color" @click="routerPush(`/kiosk/${currentStore.id}/cart`)"
      >mdi-cart-outline</v-icon
    >
  </v-badge>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";
import { routerPush } from "@/utils/commands";

const { currentStore, cartItemCount } = storeToRefs(useKioskStore());

withDefaults(
  defineProps<{
    color: string;
  }>(),
  {
    color: "black",
  }
);
</script>
