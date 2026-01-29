import { httpClient, handleError } from "../httpClient";
import type { GetPasswordParamsDto } from "../dto/password/get-password-params.dto";
import type { RequestState } from "../dto/request-state.dto";
import type { GetPasswordDto } from "../dto/password/get-password.dto";
import type { CreatePasswordDto } from "../dto/password/create-password.dto";
import type { PasswordDto } from "../dto/password/password.dto";
import type { UpdatePasswordDto } from "../dto/password/update-password.dto";
import type { MessageDto } from "../dto/message.dto";
import type { GeneratePasswordDto } from "../dto/password/generate-password.dto";

export const passwordService = {
  async getPasswords(
    params: GetPasswordParamsDto,
  ): Promise<RequestState<GetPasswordDto>> {
    try {
      const response = await httpClient.get<GetPasswordDto>("/passwords", {
        params,
      });
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async addPassword(
    password: CreatePasswordDto,
  ): Promise<RequestState<PasswordDto>> {
    try {
      const response = await httpClient.post<PasswordDto>(
        "/passwords",
        password,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async updatePassword(
    id: string,
    password: UpdatePasswordDto,
  ): Promise<RequestState<PasswordDto>> {
    try {
      const response = await httpClient.put<PasswordDto>(
        `/passwords/${id}`,
        password,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async deletePassword(id: string): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.delete<MessageDto>(`/passwords/${id}`);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async generatePassword(
    params: GeneratePasswordDto,
  ): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.get<MessageDto>(
        "/passwords/generate/",
        { params },
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
