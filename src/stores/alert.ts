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
    toastSuccess(message: string, timer = 2_000) {
      this.alert(message, timer, "#10D052", "mdi-check-circle");
    },
    toastError(message: string, timer = 60_000) {
      this.alert(message, timer, "#E5CF0D", "mdi-alert-circle");
    },
    toastInfo(message: string, timer = 30_000) {
      this.alert(message, timer, "#2196F3", "mdi-information");
    },
    toastWarning(message: string, timer = 10_000) {
      this.alert(message, timer, "#E50D0D", "mdi-alert");
    },
    alert(message: string, timer: number, color: string, icon: string) {
      this.$state.item = {
        message: message,
        timer: timer,
        color: color,
        icon: icon,
      };
      this.$state.openAlert = true;
    },
    toastClose() {
      this.$state.openAlert = false;
    },
  },
  persist: true,
});
