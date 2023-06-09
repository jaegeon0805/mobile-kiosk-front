<template>
  <v-expansion-panels v-model="openCategories" multiple tile flat>
    <v-expansion-panel
      v-for="(category, index) in value"
      :key="category.id"
      :id="`category-${index}`"
    >
      <v-expansion-panel-header
        class="font-weight-black"
        style="font-size: 18px"
      >
        {{ category.name }}
      </v-expansion-panel-header>
      <v-expansion-panel-content class="px-0">
        <v-card
          v-for="(menu, index) in category.menus"
          :key="menu.id"
          flat
          tile
          class="px-6"
          :class="{ 'border-bottom': !isLastIndex(category.menus, index) }"
          @click="routerPush(`/kiosk/${currentStore.id}/menu/${menu.id}`)"
        >
          <v-card-text class="d-flex justify-space-between px-0">
            <div>
              <span class="text-ellipsis text--primary" style="font-size: 16px">
                {{ menu.name }}
              </span>
              <span class="description text-caption">
                {{ menu.description }}
              </span>
              <span class="d-block font-weight-bold text--primary">
                {{ toPriceText(menu.price) }}
              </span>
            </div>
            <div class="ml-4">
              <v-card v-if="menu.imageUrl" rounded="lg" flat outlined>
                <v-img
                  :aspect-ratio="4 / 3"
                  :src="menu.imageUrl"
                  min-height="90px"
                  min-width="120px"
                />
              </v-card>
            </div>
          </v-card-text>
          <v-overlay
            v-if="menu.soldOutFlag"
            opacity="0.6"
            color="white"
            absolute
          >
            <v-img :src="require('/src/assets/img/sold-out.png')" />
          </v-overlay>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { CategoryForKiosk } from "@/definitions/kiosk";
import { isLastIndex, routerPush, toPriceText } from "@/utils/commands";
import { useKioskStore } from "@/stores/kiosk";
import { storeToRefs } from "pinia";

const { currentStore } = storeToRefs(useKioskStore());

const props = withDefaults(
  defineProps<{
    value: CategoryForKiosk[];
  }>(),
  {
    value: () => [] as CategoryForKiosk[],
  }
);

const openCategories = ref<number[]>([]);

watch(
  () => props.value,
  (newValue) => {
    openCategories.value = newValue.map((_, index) => index);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.v-expansion-panel-content {
  ::v-deep(.v-expansion-panel-content__wrap) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

.v-expansion-panel {
  margin-top: 8px !important;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
