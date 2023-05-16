export interface TypeItem {
  value: string;
  text: string;
}

export const ORDER_TYPE = {
  TAKE_OUT: "TAKE_OUT",
  DINE_IN: "DINE_IN",
};

export const OrderTypes: TypeItem[] = [
  { value: ORDER_TYPE.TAKE_OUT, text: "포장" },
  { value: ORDER_TYPE.DINE_IN, text: "매장" },
];

export const ORDER_STATE = {
  PAYMENT: "PAYMENT",
  COMPLETE: "COMPLETE",
  REFUND: "REFUND",
};

export const OrderStates: TypeItem[] = [
  { value: ORDER_STATE.PAYMENT, text: "주문" },
  { value: ORDER_STATE.COMPLETE, text: "완료" },
  { value: ORDER_STATE.REFUND, text: "환불" },
];

export const OPTION_TYPE = {
  MANDATORY: "필수",
  OPTIONAL: "선택",
};