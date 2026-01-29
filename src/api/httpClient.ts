import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import useAuthStore from "../store/authStore";
import { authService } from "./services/authService";
import type { ErrorDto } from "./dto/error.dto";
import type { RequestState } from "./dto/request-state.dto";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//Прикрепляем токен к запросам
httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Повтор запроса при 401
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      const refreshResponse = await authService.refresh();
      if (refreshResponse.state === "success")
        return httpClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

//Обработка ошибок
export function handleError<T>(error: unknown): RequestState<T> {
  const serverError = error as AxiosError<ErrorDto>;
  return {
    state: "error",
    code: serverError.response?.status || 500,
    errors: serverError.response?.data.errors || [],
  };
}
