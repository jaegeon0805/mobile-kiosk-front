export interface StoreFilters {
  search: string;
  availableFlag: boolean | null;
}

export interface OrderFilters {
  orderState: string[];
  orderType: string[];
  fromDateTime: Date | string;
  toDateTime: Date | string;
}

export interface MemberFilters {
  search: string;
  providerType: string[];
  suspendFlag: boolean | null;
  fromDateTime: Date | string;
  toDateTime: Date | string;
}
