import {
  LoginUserPayload,
  LoginUserResponse,
} from "@/modules/auth/schemas/login-user";
import { API_URL, Api } from "@/lib/api";

export class AuthService {
  constructor(private api: Api = new Api()) {}

  async login(payload: LoginUserPayload): Promise<LoginUserResponse> {
    const data = this.api.post<LoginUserResponse, LoginUserPayload>(
      `${API_URL}/login`,
      payload
    );
    return data;
  }

  async logout() {
    this.api.delete(`${API_URL}/logout`);
  }
}
