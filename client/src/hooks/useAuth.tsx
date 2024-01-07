import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserLogin } from "../data/schemas/User"
import { AuthContext } from "../context/AuthContext"
import { IAuthService } from "../data/services/AuthService"

type Auth = {
  isAuth: boolean
  login: (user_login: UserLogin) => Promise<void>
  logout: () => Promise<void>
  redirect: (route: string) => void
}

export function useAuth(): Auth {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAuth: boolean = authContext.isAuth();
  const authService: IAuthService = authContext.getAuthService()

  async function login(userLogin: UserLogin): Promise<void> {
    let token: string = await authService.login(userLogin);
    authContext.setToken(token);
  }

  async function logout(): Promise<void> {
    await authService.logout()
    authContext.removeToken();
  }

  function redirect(route: string) {
    useEffect(() => {
      navigate(route);
    }, []);
  }

  return { isAuth, login, logout, redirect };
}