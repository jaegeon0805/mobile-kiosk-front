<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset>
      <v-card>
        <SheetTitle title="메뉴 옵션 관리" hide-suffix />
        <v-card-text class="d-flex flex-row">
          <OptionGroupSelectTab
            v-model="optionGroup"
            :menu="value"
            class="ma-0"
          />
          <OptionDetailTable v-model="optionGroup" />
        </v-card-text>
        <SheetButton
          :sheet.sync="sheet"
          :saveBtn="false"
          close-btn-title="확인"
        />
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { Menu, OptionGroup } from "@/definitions/entities";
import { useVModel } from "@vueuse/core";
import SheetButton from "@/components/sheet/SheetButton.vue";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import OptionGroupSelectTab from "@/views/management/menu/option/OptionGroupSelectTab.vue";
import { ref } from "vue";
import OptionDetailTable from "@/views/management/menu/option/OptionDetailTable.vue";

const props = defineProps<{
  value: Menu;
  sheet: boolean;
}>();

const emits = defineEmits<{
  (e: "update:sheet", v: boolean): void;
}>();

const sheet = useVModel(props, "sheet", emits, {
  eventName: "update:sheet",
});

const optionGroup = ref<OptionGroup>();
</script>
