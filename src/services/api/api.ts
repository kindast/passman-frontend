import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import useAuthStore from "../../store/authStore";
import { authService } from "./authService";

export type RequestState<T> =
  | { status: "loading" }
  | {
      status: "success";
      statusCode: number;
      data: T;
    }
  | {
      status: "error";
      statusCode: number;
      errors: string[];
    };

export type Result<T> = {
  isSuccess: boolean;
  value: T;
  errors: string[];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      const refreshResponse = await authService.refresh();
      if (refreshResponse.status === "success") return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
