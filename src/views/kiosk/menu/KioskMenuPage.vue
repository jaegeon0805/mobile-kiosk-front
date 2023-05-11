<template>
  <div>
    <KioskAppBar
      :title="menu.name"
      :transparent-app-bar="!!menu.imageUrl"
      :shouldShowAppBar="!menu.imageUrl"
      back-space-button
    />

    <v-main>
      <KioskMenuDescription v-model="menu" />
      <KioskMenuOptions
        v-model="menu"
        :selected-mandatory-options="selectedMandatoryOptions"
        :selected-optional-options="selectedOptionalOptions"
        :total-price.sync="totalPrice"
      />
      <KioskMenuCounter v-model="quantity" />
    </v-main>

    <KioskFooter
      v-show="showFooter"
      :disabled="!isStoreOpen || isMenuSoldOut"
      @click="
        addCartItem(
          menu,
          quantity,
          selectedMandatoryOptions,
          selectedOptionalOptions
        )
      "
    >
      {{ footerTitle }}
    </KioskFooter>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router/composables";
import { getApi } from "@/utils/apis.js";
import { MenuForKiosk } from "@/definitions/kiosk.js";
import { defaultMenuForKiosk } from "@/definitions/defaults";
import { routerPush, routerReplace, toPriceText } from "@/utils/commands";
import KioskFooter from "@/views/kiosk/KioskFooter.vue";
import KioskMenuDescription from "@/views/kiosk/menu/KioskMenuDescription.vue";
import KioskMenuOptions from "@/views/kiosk/menu/KioskMenuOptions.vue";
import { Option } from "@/definitions/entities";
import KioskAppBar from "@/views/kiosk/KioskAppBar.vue";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";
import KioskMenuCounter from "@/views/kiosk/menu/KioskMenuCounter.vue";
import { useSpinnerStore } from "@/stores/loadingSpinner";

const { updateMenu, addCartItem } = useKioskStore();
const { currentStore, isStoreOpen, isMenuSoldOut } = storeToRefs(
  useKioskStore()
);
const { load } = useSpinnerStore();

const menu = ref<MenuForKiosk>(defaultMenuForKiosk());
const totalPrice = ref(0);
const quantity = ref(1);
const selectedMandatoryOptions = ref<{ [key: number]: Option }>({});
const selectedOptionalOptions = ref<{ [key: number]: Option[] }>({});
const showFooter = ref(false);

const footerTitle = computed(() => {
  return isStoreOpen.value
    ? menu.value.soldOutFlag
      ? "매진 되었습니다."
      : `${toPriceText(totalPrice.value * quantity.value)} 담기`
    : "준비 중입니다.";
});

onMounted(async () => {
  await load(async () => {
    const storeId = useRoute().params.storeId;

    if (!currentStore.value.id) {
      await routerPush(`/kiosk/${storeId}`);
    }

    const menuId = useRoute().params.menuId;
    const response = await getApi<MenuForKiosk>(`kiosk/menus/${menuId}`);

    if (response.success) {
      menu.value = response.result;
      showFooter.value = true;
      updateMenu(menu.value);
    } else {
      await routerReplace("/error/404");
    }
  });
});
</script>
