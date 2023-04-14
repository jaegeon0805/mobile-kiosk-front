import { Category, Member, Menu, Store } from "@/definitions/entities";
import { Pagination } from "@/definitions/types";

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
    description: "",
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
