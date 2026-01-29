import type { PasswordCategoryFilter } from "./types/passwordCategoryFilter";
import type { PasswordSort } from "./types/passwordSort";

export interface GetPasswordParamsDto {
  page: number;
  pageSize: number;
  search?: string;
  sort: PasswordSort;
  category: PasswordCategoryFilter;
}
