import { OrderItem } from "@/definitions/types";

export interface Id {
  id?: number;
}

export interface Member extends Id {
  email: string;
  name: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
}

export interface Store extends Id {
  name: string;
  description: string;
  availableFlag: boolean;
  suspendFlag: boolean;
}

export interface Category extends Id {
  name: string;
  availableFlag: boolean;
}

export interface Menu extends Id {
  imageUrl: string;
  name: string;
  description: string;
  price: number;
  availableFlag: boolean;
  soldOutFlag: boolean;
}

export interface OptionGroup extends Id {
  name: string;
  type: string;
  maxSelections: number | null;
}

export interface Option extends Id {
  name: string;
  price: number;
}

export interface Notification extends Id {
  store: Store;
  order: Order;
}

export interface Order extends Id {
  title: string;
  orderType: string;
  orderState: string;
  quantity: number;
  totalPrice: number;
  detail: OrderItem[];
  approveAt: Date;
}

export interface MemberForAdmin extends Id {
  email: string;
  name: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  suspendFlag: boolean;
  createdAt: Date;
  stores: Store[];
}
