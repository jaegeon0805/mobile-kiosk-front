export interface Id {
  id?: number;
}

export interface StoreForKiosk extends Id {
  name: string;
  description: string;
  availableFlag: boolean;
  categories?: CategoryForKiosk[];
}

export interface CategoryForKiosk extends Id {
  name: string;
  description: string;
  menus?: MenuForKiosk[];
}

export interface MenuForKiosk extends Id {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  soldOutFlag: boolean;
  optionGroups?: OptionGroupForKiosk[];
}

export interface OptionGroupForKiosk extends Id {
  name: string;
  type: string;
  maxSelections: number | null;
  options?: OptionForKiosk[];
}

export interface OptionForKiosk extends Id {
  name: string;
  price: number;
}

export interface CartItem {
  menu: MenuForKiosk;
  itemPrice: number;
  quantity: number;
  mandatoryOptions: { [key: number]: number[] };
  optionalOptions: { [key: number]: number[] };
  optionNames: string[];
}

export interface PaymentReadyResponse {
  nextRedirectMobileUrl: string;
  nextRedirectPcUrl: string;
}
