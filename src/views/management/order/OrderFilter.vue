<template>
  <div>
    <v-row no-gutters class="mb-1">
      <v-col cols="12">
        <FilterChip v-model="showFilter" />
      </v-col>
    </v-row>
    <v-card v-show="showFilter" outlined class="px-3 py-1 grey lighten-5">
      <CheckBoxFilter
        v-model="value.orderState"
        :items="OrderStates"
        name="주문 상태"
      />
      <CheckBoxFilter
        v-model="value.orderType"
        :items="OrderTypes"
        name="주문 타입"
      />
      <DateTimeRangeFilter
        :fromDateTime.sync="value.fromDateTime"
        :toDateTime.sync="value.toDateTime"
        name="주문 시간"
      />
      <FilterResetButton @reset="reset" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CheckBoxFilter from "@/components/filter/CheckBoxFilter.vue";
import { OrderStates, OrderTypes } from "@/definitions/enums";
import { OrderFilters } from "@/definitions/filters";
import { useVModel } from "@vueuse/core";
import FilterResetButton from "@/components/filter/FilterResetButton.vue";
import { defaultOrderFilter } from "@/definitions/defaults";
import DateTimeRangeFilter from "@/components/filter/DateTimeRangeFilter.vue";
import FilterChip from "@/components/filter/FilterChip.vue";

const props = defineProps<{
  value: OrderFilters;
}>();

const emits = defineEmits<{
  (e: "input", v: OrderFilters);
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });

const showFilter = ref(false);

function reset() {
  value.value = defaultOrderFilter();
}
</script>
