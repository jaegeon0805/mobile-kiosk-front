import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import envs from "@/constants/envs";
import { getAccessToken, routeSignInPage } from "@/utils/utils";
import { useAlertStore } from "@/stores/alert";
import store from "@/stores";
import { useMemberStore } from "@/stores/member";

const { toastError } = useAlertStore(store);
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
        return returnErrorResponse();
      } else if (401 === error.response.status) {
        if (error.response.headers["access-token"] === "expired") {
          return (await reissueToken()) && instance(error.config);
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
  try {
    const response = await axiosInstance.get<T, AxiosResponse<ApiResponse<R>>>(
      `api/v1/${url}`
    );

    if (response?.data) {
      return response.data;
    } else {
      throw new Error("No Data Return");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postApi<T = never, R = T>(
  url: string,
  data: any
): Promise<ApiResponse<R>> {
  try {
    const response = await axiosInstance.post<T, AxiosResponse<ApiResponse<R>>>(
      `api/v1/${url}`,
      data
    );

    if (response?.data) {
      return response.data;
    } else {
      throw new Error("No Data Return");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
