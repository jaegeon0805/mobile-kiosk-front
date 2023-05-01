export interface Id {
  id?: number;
}

export interface StoreForKiosk extends Id {
  name: string;
  description: string;
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
}

export interface OptionGroupForKiosk extends Id {
  name: string;
  type: string;
  maxSelections: number | null;
}

export interface OptionDetailForKiosk extends Id {
  name: string;
  price: number;
}
