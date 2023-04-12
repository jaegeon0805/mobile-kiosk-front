<template>
  <div>
    <v-tabs
      v-if="isCategoryListEmpty"
      v-model="selected"
      style="border-bottom: 1px solid"
      @change="value = categoryList[$event]"
    >
      <v-tab
        v-for="category in categoryList"
        :key="category.id"
        width="6rem"
        class="primary--text rounded"
        active-class="font-weight-black"
      >
        <span class="d-inline-block text-truncate" style="max-width: 10rem">{{
          category.name
        }}</span>
      </v-tab>
    </v-tabs>
    <span
      v-if="isCategoryEmpty"
      class="text-subtitle-2 red--text font-weight-black"
      >카테고리가 존재하지 않습니다. 카테고리를 먼저 생성해주세요!</span
    >
  </div>
</template>

<script setup lang="ts">
import { Category } from "@/definitions/entities";
import { computedAsync, useVModel } from "@vueuse/core";
import { computed, ref } from "vue";
import { getApi } from "@/utils/apis";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";

const { selectedStore } = storeToRefs(useStoreStore());

const props = withDefaults(
  defineProps<{
    value: Category | null;
  }>(),
  { value: null }
);

const emits = defineEmits<{
  (e: "input", v: Category | null): void;
}>();

const value = useVModel(props, "value", emits, { eventName: "input" });
const selected = ref<number | null>(null);
const isCategoryEmpty = ref(false);

const categoryList = computedAsync(async (): Promise<Category[]> => {
  const response = await getApi<Category[]>(
    `categories?storeId=${selectedStore.value.id}`
  );

  if (response.result.length > 0) {
    isCategoryEmpty.value = false;
    return response.result;
  } else {
    isCategoryEmpty.value = true;
    return [];
  }
}, []);

const isCategoryListEmpty = computed(() => categoryList.value.length > 0);
</script>

<style scoped>
.v-application .v-tab--active {
  background-color: rgba(33, 150, 243, 0.2) !important;
}
</style>
