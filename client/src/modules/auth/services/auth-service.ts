import {
  LoginUserPayload,
  LoginUserResponse,
} from "@/modules/auth/schemas/login-user";
import { API_LOCAL_URL, Api } from "@/api";

export class AuthService {
  constructor(private api: Api = new Api()) {}

  async login(payload: LoginUserPayload): Promise<LoginUserResponse> {
    const data = this.api.post<LoginUserResponse, LoginUserPayload>(
      `${API_LOCAL_URL}/login`,
      payload
    );
    return data;
  }
}
