import type { PasswordDto } from "./password.dto";

export interface GetPasswordDto {
  passwords: PasswordDto[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
