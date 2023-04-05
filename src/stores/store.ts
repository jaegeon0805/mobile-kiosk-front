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

      if (!this.isSelectedStore && !this.isStoreEmpty) {
        this.$state.selectedStore = this.$state.storeList[0];
      }
    },
    selectStore(store: Store) {
      this.$state.selectedStore = store;
    },
    storeClear() {
      this.$reset();
    },
  },
  persist: true,
});
