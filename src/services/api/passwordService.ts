import { AxiosError } from "axios";
import { api, type RequestState, type Result } from "./api";

export interface Password {
  id?: string;
  serviceName: string;
  url?: string;
  login: string;
  password: string;
  category?: string;
  notes?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface GetPasswordsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}

export interface GetPasswordsResponse {
  data: Array<Password>;
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface GenerateParams {
  length: number;
  useSpecialChars: boolean;
  useNumbers: boolean;
  useUppercase: boolean;
}

export const passwordService = {
  async getPasswords(
    params: GetPasswordsParams,
  ): Promise<RequestState<GetPasswordsResponse>> {
    try {
      const response = await api.get("/api/password/", { params });
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<{
        errors: string[];
      }>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async addPassword(password: Password): Promise<RequestState<Password>> {
    try {
      const response = await api.post("/api/password/", password);
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<Result<Password>>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async updatePassword(password: Password): Promise<RequestState<Password>> {
    try {
      const response = await api.put("/api/password/", password);
      return {
        status: "success",
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      const serverError = error as AxiosError<Result<Password>>;
      return {
        status: "error",
        statusCode: serverError.response?.status || 500,
        errors: serverError.response?.data.errors || [],
      };
    }
  },

  async generatePassword(
    params: GenerateParams,
  ): Promise<RequestState<string>> {
    try {
      const response = await api.get("/api/password/generate/", { params });
      return {
        status: "success",
        statusCode: response.status,
        data: response.data.value,
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

  async deletePassword(id: string): Promise<RequestState<Result<string>>> {
    try {
      const response = await api.delete("/api/password/" + id);
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
