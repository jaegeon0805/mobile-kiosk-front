import { defineStore } from "pinia";
import type { Alert } from "@/definitions/types";

export const useAlertStore = defineStore("alert", {
  state: () => {
    return {
      item: {} as Alert,
      openAlert: false,
    };
  },
  actions: {
    toastSuccess(message: string, timer = 3_000) {
      this.alert(message, timer, "#1876D2");
    },
    toastWarning(message: string, timer = 10_000) {
      this.alert(message, timer, "#ffca28");
    },
    toastError(message: string, timer = 30_000) {
      this.alert(message, timer, "#d32f2f");
    },
    alert(message: string, timer: number, color: string) {
      this.$state.item = {
        message,
        timer,
        color,
      };
      this.$state.openAlert = true;
    },
    toastClose() {
      this.$state.openAlert = false;
      this.$state.item = {} as Alert;
    },
  },
});
