import axios, { AxiosError, AxiosResponse } from "axios";
import store from "@/stores";
import envs from "@/constants/envs";
import { useAlertStore } from "@/stores/alert";

const { toastSuccess, toastError } = useAlertStore(store);

export const axiosInstance = axios.create({
  baseURL: envs.API_HOST,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    alertError(error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    if (response?.data) {
      response.data.success =
        [200, 201].includes(response.status) &&
        response.data.code?.startsWith("S");
      return response;
    } else {
      return {
        data: { success: false, code: "E" } as ApiResult,
      } as AxiosResponse;
    }
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

export interface ApiResult<T = unknown> {
  code: string;
  data: T;
  message: string;
  success: boolean;
}

function alertError(error: AxiosError): void {
  error.response && toastError(error.response.statusText || "System Error");
}

export async function getApi<T = never, R = T>(
  url: string,
): Promise<ApiResult<R>> {
  const response = await axiosInstance.get<T, AxiosResponse<ApiResult<R>>>(url);

  if (response?.data) {
    return response.data;
  } else {
    throw new Error("No data");
  }
}
