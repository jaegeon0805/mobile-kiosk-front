import {
  Category,
  Member,
  Menu,
  Option,
  OptionGroup,
  Store,
} from "@/definitions/entities";
import { Pagination } from "@/definitions/types";
import { MenuForKiosk, StoreForKiosk } from "@/definitions/kiosk";

export function defaultPagination(): Pagination {
  return {
    page: 1,
    itemsPerPage: 99999,
    sortBy: ["id"],
    sortDesc: [true],
  };
}
export function defaultMember(): Member {
  return {
    id: undefined,
    email: "",
    name: "",
    role: "ROLE_USER",
  };
}

export function defaultStore(): Store {
  return {
    id: undefined,
    name: "",
    description: "",
    availableFlag: false,
  };
}

export function defaultCategory(): Category {
  return {
    id: undefined,
    name: "",
    availableFlag: false,
  };
}

export function defaultMenu(): Menu {
  return {
    id: undefined,
    imageUrl: "",
    name: "",
    description: "",
    price: 0,
    availableFlag: false,
    soldOutFlag: false,
  };
}

export function defaultOptionGroup(): OptionGroup {
  return {
    id: undefined,
    name: "",
    type: "MANDATORY",
    maxSelections: null,
  };
}

export function defaultOption(): Option {
  return {
    id: undefined,
    name: "",
    price: 0,
  };
}

export function defaultStoreForKiosk(): StoreForKiosk {
  return {
    id: undefined,
    name: "",
    description: "",
    availableFlag: false,
  };
}

export function defaultMenuForKiosk(): MenuForKiosk {
  return {
    id: undefined,
    imageUrl: "",
    name: "",
    description: "",
    price: 0,
    soldOutFlag: false,
  };
}
