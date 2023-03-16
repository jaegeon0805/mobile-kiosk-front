import { defineStore } from "pinia";
import type { Confirm } from "@/definitions/types";

export const useConfirmStore = defineStore("confirm", {
  state: () => {
    return {
      items: [] as Confirm[],
    };
  },
  actions: {
    confirmCreate(callbackConfirm: CallableFunction) {
      this.pushConfirm("등록하시겠습니까?", callbackConfirm);
    },
    confirmUpdate(callbackConfirm: CallableFunction) {
      this.pushConfirm("수정하시겠습니까?", callbackConfirm);
    },
    confirmDelete(callbackConfirm: CallableFunction) {
      this.pushConfirm("삭제하시겠습니까?", callbackConfirm);
    },
    pushConfirm(
      content: string,
      callbackConfirm: CallableFunction,
      width = "450px",
      confirmButtonTitle = "확인",
      cancelButtonTitle = "취소"
    ) {
      this.pushConfirmWithCallbackCancel(
        content,
        callbackConfirm,
        undefined,
        width,
        confirmButtonTitle,
        cancelButtonTitle
      );
    },
    pushConfirmWithCallbackCancel(
      content: string,
      callbackConfirm: CallableFunction,
      callbackCancel?: CallableFunction,
      width = "450px",
      confirmButtonTitle = "확인",
      cancelButtonTitle = "취소"
    ) {
      this.$state.items = [
        ...this.$state.items,
        {
          content,
          width,
          cancelButtonTitle,
          confirmButtonTitle,
          callbackConfirm,
          callbackCancel,
        },
      ];
    },
    okConfirm() {
      const item = this.$state.items.shift();
      item?.callbackConfirm && item.callbackConfirm();
      this.$state.items.splice(0, 1);
    },
    closeConfirm() {
      const item = this.$state.items.shift();
      item?.callbackCancel && item.callbackCancel();
      this.$state.items.splice(0, 1);
    },
  },
});
