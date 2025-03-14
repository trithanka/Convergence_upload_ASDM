import { InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import useAuthStore from "../../../utils/cookies";

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().token; // Access token from Zustand store

  if (token) {
    if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }

    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

export const requestErrorInterceptor = (error: any): Promise<any> => {
  return Promise.reject(error);
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const responseErrorInterceptor = (error: any): Promise<any> => {
  return Promise.reject(error);
};
