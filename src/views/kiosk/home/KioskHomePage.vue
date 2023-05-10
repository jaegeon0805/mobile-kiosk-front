<template>
  <div>
    <KioskAppBar :title="store.name" />

    <v-main>
      <v-card color="#E7F8FF" flat>
        <v-card-title class="py-3 overflow-hidden" style="height: 50px">
          <span class="text-subtitle-1 font-weight-bold">
            {{ store.name }}
          </span>
          <v-spacer />
          <CartIcon />
        </v-card-title>
        <v-divider class="mx-4" />
        <v-card-text>
          <v-tabs
            v-model="selectedTabIndex"
            background-color="#D9E8F0"
            fixed-tabs
          >
            <v-tab>포장할게요</v-tab>
            <v-tab>먹고갈게요</v-tab>
          </v-tabs>
          <v-card
            flat
            tile
            outlined
            class="d-flex justify-center align-center my-2 pa-2"
            height="50px"
          >
            <span v-if="store.availableFlag" class="font-weight-black">
              {{ isTakeOutText }}
            </span>
            <span
              v-else-if="store.id && !store.availableFlag"
              class="font-weight-black"
              style="color: #fc4c4e"
            >
              <v-icon color="#fc4c4e" class="ma-1">mdi-clock-outline</v-icon>
              오늘 매장주문이 종료되었습니다.
            </span>
          </v-card>

          <v-card v-if="store.description" flat class="pa-2" outlined>
            <span class="text-caption">{{ store.description }}</span>
          </v-card>
        </v-card-text>
      </v-card>

      <KioskCategorySelectBar v-model="store.categories" />
      <KioskMenuList v-model="store.categories" />

      <div class="px-6 pt-4" style="height: 30vh">
        <span class="d-block text-overline">유의사항</span>
        <span class="d-block text-caption text--secondary"
          >* 본 서비스는 실제 서비스가 아닌, 포트폴리오 용 서비스입니다.</span
        >
        <span class="d-block text-caption text--secondary"
          >* 본 서비스는 실제로 결제되지 않으며, 모바일에 최적화
          되어있습니다.</span
        >
      </div>
    </v-main>

    <KioskFooter
      v-show="cartItemCount || !isStoreOpen"
      :disabled="!isStoreOpen"
      @click="routerPush(`/kiosk/${currentStore.id}/cart`)"
    >
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
import { useRoute } from "vue-router/composables";
import { computed, onMounted, ref, watch } from "vue";
import { getApi } from "@/utils/apis";
import { StoreForKiosk } from "@/definitions/kiosk";
import { defaultStoreForKiosk } from "@/definitions/defaults";
import { routerPush, toPriceText } from "@/utils/commands";
import KioskMenuList from "@/views/kiosk/home/KioskMenuList.vue";
import KioskCategorySelectBar from "@/views/kiosk/home/KioskCategorySelectBar.vue";
import KioskAppBar from "@/views/kiosk/KioskAppBar.vue";
import { useKioskStore } from "@/stores/kiosk";
import KioskFooter from "@/views/kiosk/KioskFooter.vue";
import { storeToRefs } from "pinia";
import CartIcon from "@/views/kiosk/CartIcon.vue";
import { useSpinnerStore } from "@/stores/loadingSpinner";

const { updateStore, updateTakeOutInfo } = useKioskStore();
const { currentStore, isStoreOpen, isTakeOut, cartItemCount, totalPrice } =
  storeToRefs(useKioskStore());
const { load } = useSpinnerStore();

const store = ref<StoreForKiosk>(defaultStoreForKiosk());
const selectedTabIndex = ref(0);

const isTakeOutText = computed(() => {
  return isTakeOut.value
    ? "가져갈 수 있게 준비됩니다."
    : "매장에서 드실 수 있게 준비됩니다.";
});

watch(
  () => selectedTabIndex.value,
  () => {
    updateTakeOutInfo(selectedTabIndex.value === 0);
  }
);

onMounted(async () => {
  await load(async () => {
    const storeId = useRoute().params.storeId;
    const response = await getApi<StoreForKiosk>(`kiosk/stores/${storeId}`);

    if (response.success) {
      store.value = response.result;
      updateStore(store.value);
      selectedTabIndex.value = isTakeOut.value ? 0 : 1;
    } else {
      await routerPush("/error/404");
    }
  });
});
</script>
