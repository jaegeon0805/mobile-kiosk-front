import { defineStore } from "pinia";
import { getStoreList } from "@/utils/commands";
import { defaultStore } from "@/definitions/defaults";
import { Store } from "@/definitions/entities";
import { useMemberStore } from "@/stores/member";

export const useStoreStore = defineStore("store", {
  state: () => ({
    selectedStore: defaultStore() as Store,
    storeList: [] as Store[],
  }),
  getters: {
    isSelectedStore(): boolean {
      return !!this.selectedStore.id;
    },
    isStoreEmpty(): boolean {
      return this.storeList.length === 0;
    },
  },
  actions: {
    async fetchStoreList(): Promise<void> {
      const { member } = useMemberStore();

      this.$state.storeList = await getStoreList(member.id);
      this.updateSelectedStore();
    },
    updateSelectedStore(): void {
      this.$state.selectedStore =
        this.$state.storeList.find((item) => {
          return item.id === this.$state.selectedStore.id;
        }) || defaultStore();

      if (!this.isStoreEmpty && !this.isSelectedStore) {
        this.$state.selectedStore = this.$state.storeList[0];
      }
    },
    selectStore(store: Store): void {
      this.$state.selectedStore = store;
    },
    storeClear(): void {
      this.$reset();
    },
  },
  persist: true,
});
