<template>
  <div>
    <v-checkbox
      v-for="option in optionGroup.options"
      v-model="selectedOptionalOptions[optionGroup.id]"
      :key="option.id"
      :value="option"
      dense
      multiple
      @change="(event) => clickOption(optionGroup, event)"
      :disabled="disabled"
    >
      <template #label>
        <span class="text-ellipsis text--primary">{{ option.name }}</span>
        <v-spacer />
        <span class="text--primary">{{ toOptionPriceText(option.price) }}</span>
      </template>
    </v-checkbox>
  </div>
</template>

<script setup lang="ts">
import { OptionForKiosk, OptionGroupForKiosk } from "@/definitions/kiosk";
import { useVModels } from "@vueuse/core";
import { useAlertStore } from "@/stores/alert";
import { toOptionPriceText } from "@/utils/commands";

const { toastWarning } = useAlertStore();

const props = defineProps<{
  disabled: boolean;
  optionGroup: OptionGroupForKiosk;
  selectedOptionalOptions: { [key: number]: OptionForKiosk[] };
}>();

const emits = defineEmits<{
  (e: "update:selectedOptionalOptions", v: { [key: number]: OptionForKiosk[] });
}>();

const { selectedOptionalOptions } = useVModels(props, emits);

function clickOption(optionGroup: OptionGroupForKiosk, event) {
  if (optionGroup.maxSelections && optionGroup.id) {
    if (event.length > optionGroup.maxSelections) {
      selectedOptionalOptions.value[optionGroup.id].pop();
      toastWarning(
        `최대 ${optionGroup.maxSelections}개만 선택이 가능합니다.`,
        3_000
      );
    }
  }
}
</script>

<style lang="scss" scoped>
.v-input {
  ::v-deep(.v-messages) {
    min-height: 0;
  }
}
</style>
