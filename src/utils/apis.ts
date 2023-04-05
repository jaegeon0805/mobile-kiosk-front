import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import envs from "@/constants/envs";
import { getAccessToken, routeSignInPage } from "@/utils/commands";
import { useAlertStore } from "@/stores/alert";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";

const { toastError, toastSuccess } = useAlertStore(store);
const { reissueToken } = useMemberStore(store);
export const axiosInstance = createAxiosInstance();

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: envs.API_HOST,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  instance.interceptors.request.use(
    async function (config) {
      await setAuthorization(config);
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    function (response) {
      if (response.data) {
        response.data.success = [200, 201].includes(response.status);
        return response;
      } else {
        return returnErrorResponse();
      }
    },
    async function (error) {
      if (error.message === "Network Error") {
        toastError("Network Error");
        return;
      }

      if ([400, 403, 404, 500].includes(error.response.status)) {
        if (error.response.data) {
          return error.response;
        }
        return returnErrorResponse();
      } else if (401 === error.response.status) {
        if (error.response.headers["access-token"] === "expired") {
          await reissueToken();
          return instance(error.config);
        } else {
          await routeSignInPage();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

async function setAuthorization(config: InternalAxiosRequestConfig) {
  config.headers["Authorization"] = await getAccessToken();
}

function returnErrorResponse() {
  return {
    data: {
      code: "E",
      success: false,
    },
  } as AxiosResponse;
}

export interface ApiResponse<T = unknown> {
  code: string;
  success: boolean;
  result: T;
  message: string;
}

export async function getApi<T = never, R = T>(
  url: string
): Promise<ApiResponse<R>> {
  const response = await axiosInstance.get<T, AxiosResponse<ApiResponse<R>>>(
    `api/v1/${url}`
  );

  if (response?.data && !response.data.success) {
    alert(response.data);
  }

  return response.data;
}

export async function postApi<T = never, R = T>(
  url: string,
  data: any,
  sendAlert = true
): Promise<ApiResponse<R>> {
  const response = await axiosInstance.post<T, AxiosResponse<ApiResponse<R>>>(
    `api/v1/${url}`,
    data
  );

  if (sendAlert) {
    alert(response.data);
  }
  return response.data;
}

export async function putApi<T = never, R = T>(
  url: string,
  data: any,
  sendAlert = true
): Promise<ApiResponse<R>> {
  const response = await axiosInstance.put<T, AxiosResponse<ApiResponse<R>>>(
    `api/v1/${url}`,
    data
  );

  if (sendAlert) {
    alert(response.data);
  }
  return response.data;
}

export async function patchApi<T = never, R = T>(
  url: string,
  data: any,
  sendAlert = true
): Promise<ApiResponse<R>> {
  const response = await axiosInstance.patch<T, AxiosResponse<ApiResponse<R>>>(
    `api/v1/${url}`,
    data
  );

  if (sendAlert) {
    alert(response.data);
  }
  return response.data;
}

export async function deleteApi<T = never, R = T>(
  url: string,
  sendAlert = true
): Promise<ApiResponse<R>> {
  const response = await axiosInstance.delete<T, AxiosResponse<ApiResponse<R>>>(
    `api/v1/${url}`
  );

  if (sendAlert) {
    alert(response.data);
  }
  return response.data;
}

function alert(data: ApiResponse<unknown>): void {
  if (data.success) {
    toastSuccess(data.message);
  } else {
    data.message && toastError(data.message);
  }
}
