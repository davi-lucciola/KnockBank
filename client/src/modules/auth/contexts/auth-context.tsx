"use client";

import { createContext, useState } from "react";
import { AuthService } from "@/modules/auth/services/auth-service";
import { LoginUserPayload } from "@/modules/auth/schemas/login-user";
import { Api } from "@/lib/api";

const tokenKey = "knock-bank.token";

interface IAuthContext {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  getToken: () => string | null;
  login: (payload: LoginUserPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState<boolean>(() =>
    getToken() ? true : false
  );

  function getToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem(tokenKey)
      : null;
  }

  const authService = new AuthService(new Api(getToken() ?? undefined));

  async function login(payload: LoginUserPayload): Promise<void> {
    const { accessToken } = await authService.login(payload);
    localStorage?.setItem(tokenKey, accessToken);
    setIsAuth(true);
  }

  async function logout() {
    await authService.logout();
    localStorage?.removeItem(tokenKey);
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, getToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
