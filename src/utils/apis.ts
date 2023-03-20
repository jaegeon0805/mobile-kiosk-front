import axios, { AxiosResponse } from "axios";
import envs from "@/constants/envs";
import { routeSignInPage } from "@/utils/utils";
import { useAlertStore } from "@/stores/alert";
import store from "@/stores";

const { toastError } = useAlertStore(store);
export const axiosInstance = createAxiosInstance();

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: envs.API_HOST,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  instance.interceptors.request.use(
    function (config) {
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

      if (400 === error.response.status) {
        return returnErrorResponse();
      } else if ([401].includes(error.response.status)) {
        await routeSignInPage();
        return;
      }
      return Promise.reject(error);
    }
  );

  return instance;
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

    if (response.data) {
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

    if (response.data) {
      return response.data;
    } else {
      throw new Error("No Data Return");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
