export interface UpdatePasswordDto {
  serviceName: string;
  url?: string;
  login: string;
  password: string;
  category: string;
  notes?: string;
  cover?: string;
}
