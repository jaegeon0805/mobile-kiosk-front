import { defineStore } from "pinia";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAlertStore } from "@/stores/alert";
import envs from "@/constants/envs";
import { useNotificationStore } from "@/stores/notification";

export const useOwnerSocketStore = defineStore("ownerWebSocket", {
  state: () => ({
    ownerClient: null as any,
  }),
  actions: {
    initializeWebSocket(uuid: string) {
      const socket = new SockJS(envs.SOCKET_URL);
      this.$state.ownerClient = new Client({
        webSocketFactory: () => socket,
      });

      this.$state.ownerClient.onConnect = () => {
        this.$state.ownerClient.subscribe(
          `/topic/store-owner/${uuid}`,
          async (message) => {
            if (message.body) {
              const { fetchNotifications } = useNotificationStore();
              const { toastSuccess } = useAlertStore();

              await fetchNotifications();
              toastSuccess(message.body, 20_000);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      };

      this.$state.ownerClient.activate();
    },
    webSocketDisconnect() {
      if (this.$state.ownerClient && this.$state.ownerClient.connected) {
        this.$state.ownerClient.deactivate();
      }

      this.$state.ownerClient = null;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
