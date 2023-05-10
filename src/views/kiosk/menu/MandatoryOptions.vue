<template>
  <v-radio-group
    v-model="selectedMandatoryOptions[optionGroup.id]"
    mandatory
    :disabled="disabled"
  >
    <v-radio
      v-for="option in optionGroup.options"
      :key="option.id"
      :value="option"
    >
      <template #label>
        <span class="text-ellipsis text--primary">{{ option.name }}</span>
        <v-spacer />
        <span class="text--primary">{{ toOptionPriceText(option.price) }}</span>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup lang="ts">
import { OptionForKiosk, OptionGroupForKiosk } from "@/definitions/kiosk";
import { useVModels } from "@vueuse/core";
import { toOptionPriceText } from "@/utils/commands";

const props = defineProps<{
  disabled: boolean;
  optionGroup: OptionGroupForKiosk;
  selectedMandatoryOptions: { [key: number]: OptionForKiosk };
}>();

const emits = defineEmits<{
  (e: "update:selectedMandatoryOptions", v: { [key: number]: OptionForKiosk });
}>();

const { selectedMandatoryOptions } = useVModels(props, emits);
</script>
