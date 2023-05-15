<template>
  <v-card flat hover class="my-2">
    <v-card-title
      class="d-flex justify-space-between text-subtitle-2 pb-1 pt-2"
    >
      <span class="text-ellipsis font-weight-black">
        {{ value.store.name }}
      </span>
      <v-icon>mdi-chevron-right</v-icon>
    </v-card-title>
    <v-card-text class="pb-2">
      <span class="text-ellipsis">{{ value.order.title }}</span>
      <span class="text-ellipsis">
        {{ value.order.quantity }}개
        {{ toPriceText(value.order.totalPrice) }}
      </span>
      <span class="text-caption">
        {{ formatDateTime(value.order.approveAt) }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toPriceText } from "@/utils/commands";
import { formatDateTime } from "@/utils/formatter";
import { Notification } from "@/definitions/entities";

defineProps<{
  value: Notification;
}>();
</script>
