<template>
  <div>
    <v-row no-gutters class="mb-1">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <FilterChip v-model="showFilter" />
        <SearchBar
          v-model="value.search"
          placeholder="점포명, 설명을 입력해주세요."
        />
      </v-col>
    </v-row>
    <v-card v-show="showFilter" outlined class="px-3 py-1 grey lighten-5">
      <CheckBoxFilter
        v-model="value.availableFlag"
        :items="AvailableTypes"
        name="활성 / 비활성"
      />
      <FilterResetButton @reset="reset" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CheckBoxFilter from "@/components/filter/CheckBoxFilter.vue";
import { StoreFilters } from "@/definitions/filters";
import { useVModel } from "@vueuse/core";
import { defaultStoreFilter } from "@/definitions/defaults";
import { AvailableTypes } from "@/definitions/enums";
import SearchBar from "@/components/filter/SearchBar.vue";
import FilterChip from "@/components/filter/FilterChip.vue";
import FilterResetButton from "@/components/filter/FilterResetButton.vue";

const props = defineProps<{
  value: StoreFilters;
}>();

const emits = defineEmits<{
  (e: "input", v: StoreFilters);
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });

const showFilter = ref(false);

function reset() {
  value.value = defaultStoreFilter();
}
</script>
