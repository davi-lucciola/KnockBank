import {
  LoginUserPayload,
  LoginUserResponse,
} from "@/modules/shared/schemas/login-user";
import { API } from "@/api";

export class AuthService {
  static async login(payload: LoginUserPayload): Promise<LoginUserResponse | null> {
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = response.json();
      return data;
    } catch (error) {
      return null
    }
  }
}
