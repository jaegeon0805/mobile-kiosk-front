<template>
  <div>
    <v-img
      v-if="value.imageUrl"
      :src="value.imageUrl"
      gradient="to top, rgba(0,0,0,0), rgba(0,0,0,0.1)"
    />
    <v-card flat>
      <v-card-title class="d-flex flex-column align-start">
        <span class="font-weight-black">
          {{ value.name }}
        </span>
        <span class="text--secondary pre-wrap" style="font-size: 16px"
          >{{ value.description }}
        </span>
      </v-card-title>
      <v-card-text
        class="d-flex justify-space-between font-weight-black text--primary text-body-1"
      >
        <span>가격</span>
        <span>{{ toPriceText(value.price) }}</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { MenuForKiosk } from "@/definitions/kiosk";
import { toPriceText } from "@/utils/commands";

defineProps<{
  value: MenuForKiosk;
}>();
</script>
