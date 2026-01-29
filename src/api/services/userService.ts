import type { MessageDto } from "../dto/message.dto";
import type { RequestState } from "../dto/request-state.dto";
import type { ChangePasswordDto } from "../dto/user/change-password.dto";
import type { DeleteAccountDto } from "../dto/user/delete-account.dto";
import type { ProfileDto } from "../dto/user/profile.dto";
import { handleError, httpClient } from "../httpClient";

export const userService = {
  async getProfile(): Promise<RequestState<ProfileDto>> {
    try {
      const response = await httpClient.get<ProfileDto>("/users");
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteAccount(
    data: DeleteAccountDto,
  ): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.delete<MessageDto>("/users", {
        data: data.password,
      });
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  async changePassword(
    data: ChangePasswordDto,
  ): Promise<RequestState<MessageDto>> {
    try {
      const response = await httpClient.put<MessageDto>(
        "/users/change-password",
        data,
      );
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
