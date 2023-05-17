<template>
  <v-card
    flat
    hover
    class="my-2"
    @click="routerPush(`/kiosk/${currentStore.id}/orders/${value.id}`)"
  >
    <v-card-title class="text-subtitle-2 pb-1 pt-2">
      <span class="text-ellipsis">{{ value.title }}</span>
      <v-spacer />
      <span :class="getOrderStateClass(value.orderState)">
        {{ getTypeName(OrderStates, value.orderState) }}
      </span>
      <v-icon class="pb-1">mdi-chevron-right</v-icon>
    </v-card-title>
    <v-card-text class="pb-2">
      <span class="text-ellipsis">
        {{ value.quantity }}개
        {{ toPriceText(value.totalPrice) }}
      </span>
      <span class="text-caption">
        {{ formatDateTime(value.approveAt) }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {
  getOrderStateClass,
  getTypeName,
  routerPush,
  toPriceText,
} from "@/utils/commands";
import { formatDateTime } from "@/utils/formatter";
import { Order } from "@/definitions/entities";
import { OrderStates } from "@/definitions/enums";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";

const { currentStore } = storeToRefs(useKioskStore());
defineProps<{
  value: Order;
}>();
</script>
