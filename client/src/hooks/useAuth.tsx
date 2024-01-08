import { useContext } from "react";
import { UserLogin } from "../data/schemas/User";
import { AuthContext } from "../context/AuthContext";
import { IAuthService } from "../data/services/AuthService";

type Auth = {
  isAuth: boolean
  login: (user_login: UserLogin) => Promise<void>
  logout: () => Promise<void>
}

export function useAuth(): Auth {
  const authContext = useContext(AuthContext);
  const isAuth: boolean = authContext.isAuth();
  const authService: IAuthService = authContext.getAuthService()

  async function login(userLogin: UserLogin): Promise<void> {
    let token: string = await authService.login(userLogin);
    authContext.setToken(token);
  }

  async function logout(): Promise<void> {
    authContext.removeToken();
    await authService.logout();
  }

  return { isAuth, login, logout };
}