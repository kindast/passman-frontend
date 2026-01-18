import type { AxiosError } from "axios";
import { api, type RequestState, type Result } from "./api";

export interface Profile {
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async profile(): Promise<RequestState<Profile>> {
    try {
      const response = await api.get<Profile>("/api/user");
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<{ errors: string[] }>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async deleteAccount(password: string): Promise<RequestState<Result<string>>> {
    try {
      const response = await api.delete("/api/user/", { data: { password } });
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

  async changePassword(
    request: ChangePasswordRequest
  ): Promise<RequestState<Result<string>>> {
    try {
      const response = await api.put("/api/user/master-password/", request);
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
