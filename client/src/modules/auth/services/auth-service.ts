import {
  LoginUserPayload,
  LoginUserResponse,
} from "@/modules/auth/schemas/login-user";
import { API_LOCAL_URL, ApiError, HttpStatus } from "@/api";

export class AuthService {
  static async login(
    payload: LoginUserPayload
  ): Promise<LoginUserResponse> {
    const response = await fetch(`${API_LOCAL_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    let data = await response.json();
    
    if (response.status === HttpStatus.Forbidden) {
      throw new ApiError(data.message, data.detail)
    }

    return data;
  }
}
