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
import { routerReplace, toPriceText } from "@/utils/commands";
import KioskFooter from "@/views/kiosk/KioskFooter.vue";
import KioskMenuDescription from "@/views/kiosk/menu/KioskMenuDescription.vue";
import KioskMenuOptions from "@/views/kiosk/menu/KioskMenuOptions.vue";
import { OptionDetail } from "@/definitions/entities";
import KioskAppBar from "@/views/kiosk/KioskAppBar.vue";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";
import KioskMenuCounter from "@/views/kiosk/menu/KioskMenuCounter.vue";

const { updateMenu, addCartItem } = useKioskStore();
const { isStoreOpen, isMenuSoldOut } = storeToRefs(useKioskStore());

const menu = ref<MenuForKiosk>(defaultMenuForKiosk());
const totalPrice = ref(0);
const quantity = ref(1);
const selectedMandatoryOptions = ref<{ [key: number]: OptionDetail }>({});
const selectedOptionalOptions = ref<{ [key: number]: OptionDetail[] }>({});

const footerTitle = computed(() => {
  return isStoreOpen.value
    ? menu.value.soldOutFlag
      ? "매진 되었습니다."
      : `${toPriceText(totalPrice.value * quantity.value)} 담기`
    : "준비 중입니다.";
});

onMounted(async () => {
  const menuId = useRoute().params.menuId;
  const response = await getApi<MenuForKiosk>(`kiosk/menus/${menuId}`);

  if (response.success) {
    menu.value = response.result;
    updateMenu(menu.value);
  } else {
    await routerReplace("/error/404");
  }
});
</script>
