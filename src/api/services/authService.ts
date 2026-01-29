import useAuthStore from "../../store/authStore";
import { handleError, httpClient } from "../httpClient";
import type { SignInDto, SignUpDto, AuthDto } from "../dto/auth";
import type { RequestState } from "../dto/request-state.dto";
import type { MessageDto } from "../dto/message.dto";

export const authService = {
  async signUp(data: SignUpDto): Promise<RequestState<AuthDto>> {
    try {
      const response = await httpClient.post<AuthDto>("/auth/signup", data);
      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async signIn(data: SignInDto): Promise<RequestState<AuthDto>> {
    try {
      const rememberMe: boolean = JSON.parse(
        localStorage.getItem("rememberMe") || "true",
      );
      const response = await httpClient.post<AuthDto>("/auth/signin", data, {
        headers: { "Forgot-Me": rememberMe ? false : true },
      });
      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async refresh(): Promise<RequestState<AuthDto>> {
    try {
      const rememberMe: boolean = JSON.parse(
        localStorage.getItem("rememberMe") || "true",
      );
      const response = await httpClient.post<AuthDto>("/auth/refresh", null, {
        headers: { "Forgot-Me": rememberMe ? false : true },
      });
      useAuthStore
        .getState()
        .setAuth(response.data.accessToken, response.data.email);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async logout(): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.post<MessageDto>("/auth/logout");
      useAuthStore.getState().clearAuth();
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
