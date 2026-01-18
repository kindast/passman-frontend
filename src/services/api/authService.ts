import type { AxiosError } from "axios";
import useAuthStore from "../../store/authStore";
import { api, type RequestState, type Result } from "./api";

export interface AuthRequest {
  email: string;
  masterPassword: string;
}

export interface AuthResponse {
  email: string;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export const authService = {
  async login(request: AuthRequest): Promise<RequestState<AuthResponse>> {
    try {
      const rememberMe: boolean = JSON.parse(
        localStorage.getItem("rememberMe") || "true"
      );
      const response = await api.post<AuthResponse>(
        "/api/auth/login",
        request,
        { headers: { "Forgot-Me": rememberMe ? false : true } }
      );
      useAuthStore.getState().setAuth(response.data.token, response.data.email);
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<Result<AuthResponse>>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async register(request: AuthRequest): Promise<RequestState<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>(
        "/api/auth/register",
        request
      );
      useAuthStore.getState().setAuth(response.data.token, response.data.email);
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<Result<AuthResponse>>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async refresh(): Promise<RequestState<AuthResponse>> {
    try {
      const rememberMe: boolean = JSON.parse(
        localStorage.getItem("rememberMe") || "true"
      );
      const response = await api.post<AuthResponse>("/api/auth/refresh", null, {
        headers: { "Forgot-Me": rememberMe ? false : true },
      });
      useAuthStore.getState().setAuth(response.data.token, response.data.email);
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<{ errors: string[] }>;
      useAuthStore.getState().clearAuth();
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async logout(): Promise<RequestState<Result<string>>> {
    try {
      const response = await api.post("/api/auth/logout");
      useAuthStore.getState().clearAuth();
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<Result<string>>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },
};
