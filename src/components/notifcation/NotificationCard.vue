<template>
  <v-card flat hover class="my-2" @click="routeOrderPage(value.store)">
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
import { routerPush, toPriceText } from "@/utils/commands";
import { formatDateTime } from "@/utils/formatter";
import { Notification, Store } from "@/definitions/entities";
import { useStoreStore } from "@/stores/store";

const { selectStore } = useStoreStore();

defineProps<{
  value: Notification;
}>();

const emits = defineEmits<{
  (e: "close-notification"): void;
}>();

async function routeOrderPage(store: Store) {
  selectStore(store);
  await routerPush("/management/order");
  emits("close-notification");
}
</script>
