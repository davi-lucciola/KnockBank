import { LoginUserPayload } from "@/modules/shared/schemas/login-user";
import { AuthService } from "@/modules/shared/services/auth-service";

export async function loginUserUseCase(payload: LoginUserPayload) {
  const data = await AuthService.login(payload)
  console.log(data)
}
