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
      this.alert(message, timer, "#009688", "mdi-check-circle");
    },
    toastWarning(message: string, timer = 10_000) {
      this.alert(message, timer, "#ffca28", "mdi-alert");
    },
    toastError(message: string, timer = 30_000) {
      this.alert(message, timer, "#d32f2f", "mdi-alert-circle");
    },
    alert(message: string, timer: number, color: string, icon: string) {
      this.$state.item = {
        message,
        timer,
        color,
        icon,
      };
      this.$state.openAlert = true;
    },
    toastClose() {
      this.$state.openAlert = false;
      this.$state.item = {} as Alert;
    },
  },
});
