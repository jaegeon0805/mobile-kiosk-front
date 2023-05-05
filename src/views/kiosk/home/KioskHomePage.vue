<template>
  <div>
    <KioskAppBar :title="store.name" />

    <v-main>
      <v-card color="#E7F8FF" flat>
        <v-card-title class="py-3" style="height: 50px">
          <span class="text-subtitle-1 font-weight-bold">
            {{ store.name }}
          </span>
          <v-spacer />
          <v-icon>mdi-cart-outline</v-icon>
        </v-card-title>
        <v-divider class="mx-4" />
        <v-card-text>
          <pre v-html="store.description" />
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/composables";
import { computed, onMounted, ref, watch } from "vue";
import { getApi } from "@/utils/apis";
import { StoreForKiosk } from "@/definitions/kiosk";
import { defaultStoreForKiosk } from "@/definitions/defaults";
import { routerPush } from "@/utils/commands";
import KioskMenuList from "@/views/kiosk/home/KioskMenuList.vue";
import KioskCategorySelectBar from "@/views/kiosk/home/KioskCategorySelectBar.vue";
import KioskAppBar from "@/views/kiosk/KioskAppBar.vue";

const store = ref<StoreForKiosk>(defaultStoreForKiosk());
const selectedTabIndex = ref(0);
const isTakeOut = ref(true);

const isTakeOutText = computed(() => {
  return isTakeOut.value
    ? "가져갈 수 있게 준비됩니다."
    : "매장에서 드실 수 있게 준비됩니다.";
});

watch(
  () => selectedTabIndex.value,
  () => {
    isTakeOut.value = selectedTabIndex.value === 0;
  }
);

onMounted(async () => {
  const storeId = useRoute().params.storeId;
  const response = await getApi<StoreForKiosk>(`kiosk/stores/${storeId}`);

  if (response.success) {
    store.value = response.result;
  } else {
    await routerPush("/error/404");
  }
});
</script>
