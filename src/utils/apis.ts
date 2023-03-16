import axios, { AxiosResponse } from "axios";
import envs from "@/constants/envs";

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
        return {
          data: {
            code: "E",
            success: false,
          },
        } as AxiosResponse;
      }
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
}

export interface ApiResponse<T = unknown> {
  code: string;
  success: boolean;
  result: T;
  message: string;
}

export async function getApi<T = never, R = T>(url: string) {
  try {
    const response = await axiosInstance.get<T, AxiosResponse<ApiResponse<R>>>(
      url
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
