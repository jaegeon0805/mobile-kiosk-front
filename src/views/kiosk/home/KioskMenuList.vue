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
        >
          <v-card-text class="d-flex justify-space-between px-0">
            <div>
              <span
                class="text-ellipsis font-weight-black"
                style="font-size: 16px"
              >
                {{ menu.name }}
              </span>
              <span class="description">{{ menu.description }}</span>
              <span class="d-block font-weight-bold">
                {{ Number(menu.price).toLocaleString() }}원
              </span>
            </div>
            <div class="ml-4">
              <v-card
                v-if="menu.imageUrl"
                width="120px"
                height="120px"
                rounded="lg"
                flat
              >
                <v-img aspect-ratio="1" :src="menu.imageUrl" />
              </v-card>
            </div>
          </v-card-text>
          <v-overlay
            v-if="menu.soldOutFlag"
            opacity="0.6"
            color="white"
            absolute
          >
            <span class="font-weight-black text-h6" style="color: #fc4c4e">
              Sold out
            </span>
          </v-overlay>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CategoryForKiosk } from "@/definitions/kiosk";

const props = withDefaults(
  defineProps<{
    value: CategoryForKiosk[];
  }>(),
  {
    value: () => [] as CategoryForKiosk[],
  }
);

const openCategories = computed(() => {
  return props.value?.map((_, index) => index);
});

function isLastIndex(list: any[], index: number): boolean {
  return index === list.length - 1;
}
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

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
