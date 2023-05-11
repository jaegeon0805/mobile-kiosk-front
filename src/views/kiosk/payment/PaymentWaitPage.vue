<template>
  <v-card class="ma-2 pa-2 d-flex justify-center align-center" flat outlined>
    <v-card-title class="primary--text">결제가 진행중입니다.</v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { patchApi } from "@/utils/apis";
import { useRoute } from "vue-router/composables";
import { routerPush } from "@/utils/commands";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import { useSpinnerStore } from "@/stores/loadingSpinner";

const { currentStore } = storeToRefs(useKioskStore());
const { clearCart } = useKioskStore();
const { load } = useSpinnerStore();
const { query } = useRoute();

onMounted(async () => {
  await load(async () => {
    const storeId = useRoute().params.storeId;

    if (!currentStore.value.id) {
      await routerPush(`/kiosk/${storeId}`);
    }

    const orderId = query.orderId;
    const pgToken = query.pg_token;

    const response = await patchApi(
      `kiosk-orders/${orderId}/approve?pgToken=${pgToken}`,
      null
    );

    if (response.success) {
      clearCart();
      await routerPush(`/kiosk/${currentStore.value.id}/order`);
    } else {
      await routerPush(`kiosk/${currentStore.value.id}/cart`);
    }
  });
});
</script>
