export interface OrderFilters {
  orderState: string[];
  orderType: string[];
  fromDateTime: Date | string;
  toDateTime: Date | string;
}
