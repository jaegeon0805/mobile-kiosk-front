import { defineStore } from "pinia";

export const useSpinnerStore = defineStore("loading-spinner", {
  state: () => ({
    loading: false,
  }),
  actions: {
    async load(callbackConfirm: CallableFunction): Promise<void> {
      try {
        this.$state.loading = true;
        await callbackConfirm();
      } finally {
        this.$state.loading = false;
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
