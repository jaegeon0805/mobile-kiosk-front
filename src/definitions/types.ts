export interface Alert {
  message: string;
  timer: number;
  color: string;
  icon: string;
}

export interface Confirm {
  content: string;
  cancelButtonTitle: string;
  confirmButtonTitle: string;
  width: string;
  callbackConfirm: CallableFunction;
  callbackCancel?: CallableFunction;
}
