<template>
  <div>
    <v-card
      v-for="optionGroup in value.optionGroups"
      :key="optionGroup.id"
      flat
      class="mt-3"
    >
      <v-card-title class="d-flex align-start">
        <div class="d-flex flex-column">
          <span class="font-weight-black" style="font-size: 18px">
            {{ optionGroup.name }}
          </span>
          <span
            v-if="optionGroup.type === 'OPTIONAL' && optionGroup.maxSelections"
            class="text--secondary text-subtitle-2"
          >
            최대 {{ optionGroup.maxSelections }}개 선택
          </span>
        </div>
        <v-spacer />
        <v-chip
          small
          class="font-weight-black mt-1"
          :color="
            optionGroup.type === 'MANDATORY' ? 'rgba(33, 150, 243, 0.2)' : ''
          "
          :text-color="
            optionGroup.type === 'MANDATORY' ? 'primary' : 'rgba(0, 0, 0, 0.4)'
          "
        >
          {{ optionGroup.type === "MANDATORY" ? "필수" : "선택" }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <MandatoryOptions
          v-if="optionGroup.type === 'MANDATORY'"
          :optionGroup="optionGroup"
          :selected-mandatory-options.sync="selectedMandatoryOptions"
          :disabled="!isStoreOpen || isMenuSoldOut"
        />
        <OptionalOptions
          v-else
          :option-group="optionGroup"
          :selected-optional-options="selectedOptionalOptions"
          :disabled="!isStoreOpen || isMenuSoldOut"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { MenuForKiosk } from "@/definitions/kiosk";
import { ref, watch } from "vue";
import { Option } from "@/definitions/entities";
import { keys } from "lodash";
import { useVModels } from "@vueuse/core";
import MandatoryOptions from "@/views/kiosk/menu/MandatoryOptions.vue";
import OptionalOptions from "@/views/kiosk/menu/OptionalOptions.vue";
import { storeToRefs } from "pinia";
import { useKioskStore } from "@/stores/kiosk";

const { isStoreOpen, isMenuSoldOut } = storeToRefs(useKioskStore());

const props = defineProps<{
  value: MenuForKiosk;
  selectedOptionalOptions: { [key: number]: Option[] };
  selectedMandatoryOptions: { [key: number]: Option };
  totalPrice: number;
}>();

const emits = defineEmits<{
  (e: "update:selectedOptionalOptions", v: { [key: number]: Option[] });
  (e: "update:selectedMandatoryOptions", v: { [key: number]: Option });
  (e: "update:totalPrice", v: number);
}>();

const { selectedOptionalOptions, selectedMandatoryOptions, totalPrice } =
  useVModels(props, emits);

const optionalOptionsPrice = ref(0);
const mandatoryOptionsPrice = ref(0);

watch(selectedOptionalOptions.value, () => {
  optionalOptionsPrice.value = 0;
  for (const key of keys(selectedOptionalOptions.value)) {
    selectedOptionalOptions.value[key].forEach((option) => {
      optionalOptionsPrice.value += option.price;
    });
  }
});

watch(selectedMandatoryOptions.value, () => {
  mandatoryOptionsPrice.value = 0;
  for (const key of keys(selectedMandatoryOptions.value)) {
    mandatoryOptionsPrice.value += selectedMandatoryOptions.value[key].price;
  }
});

watch(
  () => [
    props.value.price,
    optionalOptionsPrice.value,
    mandatoryOptionsPrice.value,
  ],
  () => {
    totalPrice.value =
      props.value.price +
      optionalOptionsPrice.value +
      mandatoryOptionsPrice.value;
  }
);
</script>
