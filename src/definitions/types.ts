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

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Member {
  email: string;
  name: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
}
