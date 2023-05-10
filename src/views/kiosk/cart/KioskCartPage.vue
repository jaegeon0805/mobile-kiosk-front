<template>
  <div>
    <KioskCartAppBar />

    <v-main>
      <v-card flat>
        <v-card-title class="text-subtitle-1 font-weight-black pb-0">
          {{ currentStore.name }}
        </v-card-title>
        <v-card-text class="pb-0">
          <v-radio-group class="font-weight-black" v-model="isTakeOut">
            <v-radio label="포장" :value="true" />
            <v-radio label="매장" :value="false" />
          </v-radio-group>
        </v-card-text>
      </v-card>

      <v-card class="mt-2" flat>
        <v-card-text
          v-for="(item, index) in cart"
          :key="index"
          class="border-bottom"
        >
          <div>
            <div class="d-flex justify-space-between align-center">
              <span class="font-weight-black text--primary text-ellipsis">
                {{ item.menu.name }}
              </span>
              <v-icon @click="removeCartItem(item)">mdi-close</v-icon>
            </div>
            <span class="text-caption">{{ item.optionNames.join(", ") }}</span>
          </div>
          <div class="d-flex justify-space-between align-center mt-4">
            <span class="text-subtitle-1 font-weight-black text--primary">
              {{ toPriceText(item.itemPrice * item.quantity) }}
            </span>
            <CounterBtn
              :quantity="item.quantity"
              :max="100"
              @minus="changeQuantity(item, item.quantity - 1)"
              @plus="changeQuantity(item, item.quantity + 1)"
            />
          </div>
        </v-card-text>
      </v-card>

      <v-card
        class="d-flex justify-center align-center"
        flat
        @click="routerPush(`/kiosk/${currentStore.id}`)"
      >
        <span class="font-weight-medium primary--text ma-4">
          <v-icon color="primary">mdi-plus</v-icon>
          메뉴 추가하기
        </span>
      </v-card>
    </v-main>

    <KioskFooter v-show="isNotEmptyCart" :disabled="!isStoreOpen" @click="pay">
      <template v-if="!isStoreOpen">
        <span>준비 중입니다.</span>
      </template>
      <template v-else>
        <span>
          {{ toPriceText(totalPrice) }} 주문하기
          <v-chip
            color="white"
            text-color="primary"
            class="font-weight-black"
            small
          >
            {{ cartItemCount }}
          </v-chip>
        </span>
      </template>
    </KioskFooter>
  </div>
</template>

<script setup lang="ts">
import KioskCartAppBar from "@/views/kiosk/cart/KioskCartAppBar.vue";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { routerPush, toPriceText } from "@/utils/commands";
import KioskFooter from "@/views/kiosk/KioskFooter.vue";
import CounterBtn from "@/views/kiosk/CounterBtn.vue";
import { postApi } from "@/utils/apis";
import { PaymentReadyResponse } from "@/definitions/kiosk";
import { useSpinnerStore } from "@/stores/loadingSpinner";

const { updateTakeOutInfo, changeQuantity, removeCartItem } = useKioskStore();
const {
  currentStore,
  isTakeOut,
  cart,
  isNotEmptyCart,
  isStoreOpen,
  totalPrice,
  cartItemCount,
  customerUuid,
} = storeToRefs(useKioskStore());
const { load } = useSpinnerStore();

async function pay() {
  await load(async () => {
    const response = await postApi<PaymentReadyResponse>(
      `kiosk-orders?storeId=${currentStore.value.id}`,
      {
        customerUuid: customerUuid.value,
        cartItems: cart.value.map((item) => {
          return {
            menuId: item.menu.id,
            quantity: item.quantity,
            options: {
              ...item.mandatoryOptions,
              ...item.optionalOptions,
            },
          };
        }),
      },
      false
    );

    if (response.success) {
      window.location.href = response.result.nextRedirectMobileUrl;
    }
  });
}

watch(
  () => isTakeOut.value,
  () => {
    updateTakeOutInfo(isTakeOut.value);
  }
);
</script>
