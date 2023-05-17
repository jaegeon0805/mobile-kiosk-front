<template>
  <div>
    <KioskOrderAppBar
      title="주문 확인"
      @click="routerPush(`/kiosk/${currentStore.id}`)"
    />

    <v-main>
      <OrderCard v-for="order in orders" :key="order.id" :value="order" />

      <v-card
        class="d-flex justify-center align-center"
        flat
        @click="routerPush(`/kiosk/${currentStore.id}`)"
      >
        <span class="font-weight-medium primary--text ma-4">
          <v-icon color="primary">mdi-plus</v-icon>
          주문하로 가기
        </span>
      </v-card>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useSpinnerStore } from "@/stores/loadingSpinner";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import OrderCard from "@/views/kiosk/order/OrderCard.vue";
import KioskOrderAppBar from "@/views/kiosk/order/KioskOrderAppBar.vue";
import { routerPush } from "@/utils/commands";

const { load } = useSpinnerStore();
const { currentStore, orders } = storeToRefs(useKioskStore());
const { fetchOrders } = useKioskStore();

onMounted(async () => {
  await load(async () => {
    await fetchOrders();
  });
});
</script>
