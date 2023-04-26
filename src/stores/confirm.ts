import { defineStore } from "pinia";
import type { Confirm } from "@/definitions/types";

export const useConfirmStore = defineStore("confirm", {
  state: () => {
    return {
      item: {} as Confirm,
      openConfirm: false,
    };
  },
  actions: {
    confirmCreate(
      callbackConfirm: CallableFunction,
      content = "등록하시겠습니까?"
    ) {
      this.confirm(content, callbackConfirm);
    },
    confirmUpdate(
      callbackConfirm: CallableFunction,
      content = "수정하시겠습니까?"
    ) {
      this.confirm(content, callbackConfirm);
    },
    confirmDelete(
      callbackConfirm: CallableFunction,
      content = "삭제하시겠습니까?"
    ) {
      this.confirm(content, callbackConfirm);
    },
    confirm(
      content: string,
      callbackConfirm: CallableFunction,
      width = "450px",
      confirmButtonTitle = "확인",
      cancelButtonTitle = "취소"
    ) {
      this.confirmWithCallbackCancel(
        content,
        callbackConfirm,
        undefined,
        width,
        confirmButtonTitle,
        cancelButtonTitle
      );
    },
    confirmWithCallbackCancel(
      content: string,
      callbackConfirm: CallableFunction,
      callbackCancel?: CallableFunction,
      width = "450px",
      confirmButtonTitle = "확인",
      cancelButtonTitle = "취소"
    ) {
      this.$state.item = {
        content,
        width,
        cancelButtonTitle,
        confirmButtonTitle,
        callbackConfirm,
        callbackCancel,
      };
      this.$state.openConfirm = true;
    },
    okConfirm() {
      this.$state.item?.callbackConfirm && this.$state.item.callbackConfirm();
      this.$state.item = {} as Confirm;
      this.openConfirm = false;
    },
    closeConfirm() {
      this.$state.item?.callbackCancel && this.$state.item.callbackCancel();
      this.$state.item = {} as Confirm;
      this.openConfirm = false;
    },
  },
});
