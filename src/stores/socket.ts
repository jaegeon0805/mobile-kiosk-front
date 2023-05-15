import { defineStore } from "pinia";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAlertStore } from "@/stores/alert";
import envs from "@/constants/envs";
import { useNotificationStore } from "@/stores/notification";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    stompClient: null as any,
  }),
  actions: {
    initializeWebSocket(uuid: string) {
      const socket = new SockJS(envs.SOCKET_URL);
      this.$state.stompClient = new Client({
        webSocketFactory: () => socket,
      });

      this.$state.stompClient.onConnect = () => {
        this.$state.stompClient.subscribe(
          `/topic/store-owner/${uuid}`,
          async (message) => {
            if (message.body) {
              const { fetchNotifications } = useNotificationStore();
              const { toastSuccess } = useAlertStore();

              await fetchNotifications();
              toastSuccess(message.body, 10_000);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      };

      this.$state.stompClient.activate();
    },
    disconnect() {
      if (this.$state.stompClient && this.$state.stompClient.connected) {
        this.$state.stompClient.deactivate();
      }

      this.$state.stompClient = null;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
