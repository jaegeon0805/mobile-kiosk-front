<template>
  <div>
    <KioskOrderAppBar
      title="주문 상세"
      @click="routerPush(`/kiosk/${currentStore.id}/orders`)"
    />

    <v-main>
      <OrderDetailCard
        v-for="(item, index) in orderItems"
        :key="index"
        :value="item"
      />
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSpinnerStore } from "@/stores/loadingSpinner";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import OrderDetailCard from "@/views/management/order/OrderDetailCard.vue";
import KioskOrderAppBar from "@/views/kiosk/order/KioskOrderAppBar.vue";
import { routerPush, routerReplace } from "@/utils/commands";
import { OrderItem } from "@/definitions/types";
import { useRoute } from "vue-router/composables";
import { useAlertStore } from "@/stores/alert";

const { load } = useSpinnerStore();
const { currentStore, orders } = storeToRefs(useKioskStore());
const { toastError } = useAlertStore();

const orderItems = ref<OrderItem[]>([]);

onMounted(async () => {
  await load(async () => {
    const orderId = Number(useRoute().params.orderId);

    const order = orders.value.find((order) => order.id === orderId);

    if (order) {
      orderItems.value = order.detail;
    } else {
      toastError("확인할 수 없는 주문입니다.");
      await routerReplace(`/kiosk/${currentStore.value.id}/orders`);
    }
  });
});
</script>
