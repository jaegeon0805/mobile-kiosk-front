import { Member } from "@/definitions/types";

export function defaultMember(): Member {
  return {
    email: "",
    name: "",
    role: "ROLE_USER",
  };
}
