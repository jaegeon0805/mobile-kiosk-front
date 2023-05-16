import { defineStore } from "pinia";
import { Notification } from "@/definitions/entities";
import { getApi, patchApi } from "@/utils/apis";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    notificationCounter(): number {
      return this.notifications.length;
    },
  },
  actions: {
    async fetchNotifications() {
      const response = await getApi<Notification[]>("notifications");

      if (response.success) {
        this.$state.notifications = response.result;
      }
    },
    async readNotifications(storeId: number) {
      if (
        this.$state.notifications.some(
          (notification) => notification.store.id === storeId
        )
      ) {
        const response = await patchApi<Notification[]>(
          `notifications?storeId=${storeId}`,
          null,
          false
        );

        if (response.success) {
          this.$state.notifications = response.result;
        }
      }
    },
    notificationClear() {
      this.$reset();
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
