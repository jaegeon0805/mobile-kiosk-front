export interface Alert {
  message: string;
  timer: number;
  color: string;
}

export interface Confirm {
  content: string;
  cancelButtonTitle: string;
  confirmButtonTitle: string;
  width: string;
  callbackConfirm: CallableFunction;
  callbackCancel?: CallableFunction;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface NavItem {
  icon: string;
  title: string;
  url: string;
}

export interface Pagination {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
  sortDesc: boolean[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
