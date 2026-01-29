import type { FileDto } from "../dto/cover/file.dto";
import type { RequestState } from "../dto/request-state.dto";
import { handleError, httpClient } from "../httpClient";

export const coverService = {
  async uploadCover(data: FormData): Promise<RequestState<FileDto>> {
    try {
      const response = await httpClient.post<FileDto>("/covers", data);
      return { state: "success", code: response.status, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};
