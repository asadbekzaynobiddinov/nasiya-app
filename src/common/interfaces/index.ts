import { AdminRoles } from '../enum';

export interface IPayload {
  sub: string;
  login: string;
  is_active: boolean;
}

export interface IAdminPayload {
  sub: string;
  username: string;
  role: AdminRoles;
}

export class TokenResponse {
  accessToken: string;
  refreshToken: string;
}
