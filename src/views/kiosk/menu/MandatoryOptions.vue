<template>
  <v-radio-group
    v-model="selectedMandatoryOptions[optionGroup.id]"
    mandatory
    :disabled="disabled"
  >
    <v-radio
      v-for="optionDetail in optionGroup.optionDetails"
      :key="optionDetail.id"
      :value="optionDetail"
    >
      <template #label>
        <span class="text-ellipsis text--primary">{{ optionDetail.name }}</span>
        <v-spacer />
        <span class="text--primary">{{
          toOptionPriceText(optionDetail.price)
        }}</span>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup lang="ts">
import { OptionDetailForKiosk, OptionGroupForKiosk } from "@/definitions/kiosk";
import { useVModels } from "@vueuse/core";
import { toOptionPriceText } from "@/utils/commands";

const props = defineProps<{
  disabled: boolean;
  optionGroup: OptionGroupForKiosk;
  selectedMandatoryOptions: { [key: number]: OptionDetailForKiosk };
}>();

const emits = defineEmits<{
  (
    e: "update:selectedMandatoryOptions",
    v: { [key: number]: OptionDetailForKiosk }
  );
}>();

const { selectedMandatoryOptions } = useVModels(props, emits);
</script>
