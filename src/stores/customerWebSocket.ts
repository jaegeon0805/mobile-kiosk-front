import { defineStore, storeToRefs } from "pinia";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAlertStore } from "@/stores/alert";
import envs from "@/constants/envs";
import { useKioskStore } from "@/stores/kiosk";
import { useConfirmStore } from "@/stores/confirm";
import { routerPush } from "@/utils/commands";
import { getApi } from "@/utils/apis";
import { StoreForKiosk } from "@/definitions/kiosk";

export const useCustomerSocketStore = defineStore("customerWebSocket", {
  state: () => ({
    customerClient: null as any,
  }),
  actions: {
    initializeWebSocket(uuid: string) {
      const socket = new SockJS(envs.SOCKET_URL);
      this.$state.customerClient = new Client({
        webSocketFactory: () => socket,
      });

      const { currentStore } = storeToRefs(useKioskStore());
      const { fetchOrders, updateStore } = useKioskStore();

      this.$state.customerClient.onConnect = () => {
        this.$state.customerClient.subscribe(
          `/queue/customer/${uuid}`,
          async (message) => {
            if (message.body) {
              const { confirm } = useConfirmStore();

              await fetchOrders();
              confirm(
                message.body,
                async () => {
                  await routerPush(`/kiosk/${currentStore.value.id}/orders`);
                },
                "450px",
                "이동"
              );
            }
          },
          (error) => {
            console.log(error);
          }
        );

        this.$state.customerClient.subscribe(
          `/topic/store/${currentStore.value.id}`,
          async (message) => {
            if (message.body) {
              const { toastWarning } = useAlertStore();

              const response = await getApi<StoreForKiosk>(
                `kiosk/stores/${currentStore.value.id}`
              );

              if (response.success) {
                updateStore(response.result);
                toastWarning(message.body);
              } else {
                await routerPush("/error/404");
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
      };

      this.$state.customerClient.activate();
    },
    webSocketDisconnect() {
      if (this.$state.customerClient && this.$state.customerClient.connected) {
        this.$state.customerClient.deactivate();
      }

      this.$state.customerClient = null;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
