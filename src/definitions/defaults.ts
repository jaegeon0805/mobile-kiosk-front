import { Member, Store } from "@/definitions/entities";

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
    state: "CLOSE",
  };
}
