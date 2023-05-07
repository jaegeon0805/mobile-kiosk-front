import { defineStore } from "pinia";
import {
  defaultMenuForKiosk,
  defaultStore,
  defaultStoreForKiosk,
} from "@/definitions/defaults";
import { CartItem, MenuForKiosk, StoreForKiosk } from "@/definitions/kiosk";
import { OptionDetail } from "@/definitions/entities";
import { isEquals, routerPush } from "@/utils/commands";
import { useAlertStore } from "@/stores/alert";

export const useKioskStore = defineStore("kiosk", {
  state: () => ({
    currentStore: defaultStoreForKiosk() as StoreForKiosk,
    currentMenu: defaultMenuForKiosk() as MenuForKiosk,
    isTakeOut: true,
    cart: [] as CartItem[],
  }),
  getters: {
    isStoreOpen(): boolean {
      return this.currentStore.availableFlag;
    },
    isMenuSoldOut(): boolean {
      return this.currentMenu.soldOutFlag;
    },
    isNotEmptyCart(): boolean {
      return this.cart.length > 0;
    },
    cartItemCount(): number | string {
      let totalItemCount = 0;
      this.cart.forEach((item) => (totalItemCount += item.quantity));
      return totalItemCount > 99 ? "99+" : totalItemCount;
    },
    totalPrice(): number {
      let totalPrice = 0;
      this.cart.forEach(
        (item) => (totalPrice += item.itemPrice * item.quantity)
      );
      return totalPrice;
    },
  },
  actions: {
    updateStore(store: StoreForKiosk): void {
      this.$state.currentStore = store || defaultStore();
    },
    updateMenu(menu: MenuForKiosk): void {
      this.$state.currentMenu = menu || defaultMenuForKiosk();
    },
    updateTakeOutInfo(value: boolean) {
      this.$state.isTakeOut = value;
    },
    async addCartItem(
      menu: MenuForKiosk,
      quantity: number,
      selectedMandatoryOptions: { [key: number]: OptionDetail },
      selectedOptionalOptions: { [key: number]: OptionDetail[] }
    ) {
      const optionNames = [] as string[];
      let itemPrice = menu.price;
      const mandatoryOptions = {};
      const optionalOptions = {};

      Object.keys(selectedMandatoryOptions)
        .sort()
        .forEach((key) => {
          mandatoryOptions[key] = [selectedMandatoryOptions[key].id];
          itemPrice += selectedMandatoryOptions[key].price;
          optionNames.push(selectedMandatoryOptions[key].name);
        });

      Object.keys(selectedOptionalOptions)
        .sort()
        .forEach((key) => {
          optionalOptions[key] = selectedOptionalOptions[key]
            .map((option) => {
              itemPrice += option.price;
              optionNames.push(option.name);
              return option.id;
            })
            .sort();
        });

      const newItem: CartItem = {
        menu,
        itemPrice,
        quantity,
        mandatoryOptions,
        optionalOptions,
        optionNames,
      };

      const index = this.$state.cart.findIndex((oldItem) => {
        return (
          oldItem.menu.id === newItem.menu.id &&
          isEquals(oldItem.mandatoryOptions, newItem.mandatoryOptions) &&
          isEquals(oldItem.optionalOptions, newItem.optionalOptions)
        );
      });

      if (index === -1) {
        this.$state.cart = [...this.$state.cart, newItem];
        await routerPush(`/kiosk/${this.$state.currentStore.id}`);
      } else {
        if (this.$state.cart[index].quantity + newItem.quantity <= 100) {
          this.$state.cart[index].quantity += newItem.quantity;
          await routerPush(`/kiosk/${this.$state.currentStore.id}`);
        } else {
          const { toastWarning } = useAlertStore();
          toastWarning(
            "메뉴별로 최대 100개 까지 주문하실 수 있습니다. 수량을 변경해주세요.",
            3_000
          );
        }
      }
    },
    removeCartItem(item: CartItem) {
      this.$state.cart = this.$state.cart.filter(
        (oldItem) => !isEquals(oldItem, item)
      );
    },
    changeQuantity(item: CartItem, quantity: number) {
      const oldItem = this.$state.cart.find((oldItem) =>
        isEquals(oldItem, item)
      );

      if (oldItem) {
        oldItem.quantity = quantity;
      }
    },
    clearCart() {
      this.$state.cart = [] as CartItem[];
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
