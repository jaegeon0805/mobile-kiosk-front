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
        :selected-optional-options="selectedOptionalOptions"
        :selected-mandatory-options="selectedMandatoryOptions"
        :total-price.sync="totalPrice"
      />
    </v-main>

    <KioskFooter :title="`${Number(totalPrice).toLocaleString()}원 담기`" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router/composables";
import { getApi } from "@/utils/apis.js";
import { MenuForKiosk } from "@/definitions/kiosk.js";
import { defaultMenuForKiosk } from "@/definitions/defaults";
import { routerReplace } from "@/utils/commands";
import KioskFooter from "@/views/kiosk/KioskFooter.vue";
import KioskMenuDescription from "@/views/kiosk/menu/KioskMenuDescription.vue";
import KioskMenuOptions from "@/views/kiosk/menu/KioskMenuOptions.vue";
import { OptionDetail } from "@/definitions/entities";
import KioskAppBar from "@/views/kiosk/KioskAppBar.vue";

const menu = ref<MenuForKiosk>(defaultMenuForKiosk());
const totalPrice = ref(0);
const selectedOptionalOptions = ref<{ [key: number]: OptionDetail[] }>({});
const selectedMandatoryOptions = ref<{ [key: number]: OptionDetail }>({});

onMounted(async () => {
  const menuId = useRoute().params.menuId;
  const response = await getApi<MenuForKiosk>(`kiosk/menus/${menuId}`);

  if (response.success) {
    menu.value = response.result;
  } else {
    await routerReplace("/error/404");
  }
});
</script>
