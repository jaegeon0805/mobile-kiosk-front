<template>
  <v-list class="ma-4">
    <v-menu offset-y transition="slide-y-transition" max-height="30%">
      <template v-slot:activator="{ on }">
        <div
          class="menu-color pa-3 rounded-lg white--text d-flex justify-space-between align-center"
          v-on="on"
        >
          <div>
            <p class="subtitle-1 mb-0">지점 선택</p>
            <p class="text-subtitle-2 mb-0 grey--text text--lighten-1">
              {{ SelectedStoreName }}
            </p>
          </div>
          <div>
            <v-icon color="white">mdi-chevron-down</v-icon>
          </div>
        </div>
      </template>

      <v-list
        dense
        class="d-flex flex-column align-center"
        dark
        color="#252939"
      >
        <v-list-item v-if="isStoreEmpty" @click="openCreateSheet">
          <v-list-item-title class="primary--text"
            >지점 생성하기</v-list-item-title
          >
        </v-list-item>
        <v-list-item
          v-for="store in storeList"
          :key="store.id"
          @click="selectStore(store)"
        >
          <v-list-item-title> {{ store.name }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <StoreEditSheet v-if="sheet" :sheet.sync="sheet" v-model="editItem" />
  </v-list>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import StoreEditSheet from "@/views/management/store/StoreEditSheet.vue";
import { useStoreStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useEditItem } from "@/compositions/useEditItem";
import { defaultStore } from "@/definitions/defaults";

const { fetchStoreList, selectStore } = useStoreStore();
const { isSelectedStore, isStoreEmpty, selectedStore, storeList } = storeToRefs(
  useStoreStore()
);

const { sheet, editItem, openCreateSheet } = useEditItem(defaultStore);

const SelectedStoreName = computed(() => {
  return isSelectedStore.value
    ? selectedStore.value.name
    : "지점을 생성해 주세요.";
});

onMounted(async () => {
  if (!isSelectedStore) {
    await fetchStoreList();
  }
});
</script>

<style scoped>
.menu-color {
  background-color: #292f3d;
}
</style>
