<template>
  <v-app-bar app fixed elevation="0" color="white" height="50px" width="100%">
    <v-icon class="mr-2" color="black" @click="emits('click')">
      mdi-arrow-left
    </v-icon>
    <v-spacer />
    <span class="text-subtitle-1 font-weight-bold"> {{ title }} </span>
    <v-spacer />
    <CartIcon />
  </v-app-bar>
</template>

<script setup lang="ts">
import CartIcon from "@/views/kiosk/CartIcon.vue";

defineProps<{
  title: string;
}>();

const emits = defineEmits<{
  (e: "click"): void;
}>();
</script>
