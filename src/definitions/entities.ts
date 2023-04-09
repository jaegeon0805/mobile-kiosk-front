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
}

export interface Category extends Id {
  name: string;
  description: string;
  availableFlag: boolean;
}
