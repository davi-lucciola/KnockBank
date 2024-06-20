"use client";

import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { AuthService } from "@/modules/auth/services/auth-service";
import { LoginUserPayload } from "@/modules/auth/schemas/login-user";
import { getToken } from "@/lib/token";

interface IAuthContext {
  isAuth: boolean;
  login: (payload: LoginUserPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const authService = new AuthService();
  const [isAuth, setIsAuth] = useState<boolean>(() =>
    getToken() ? true : false
  );

  async function login(payload: LoginUserPayload): Promise<void> {
    const { accessToken } = await authService.login(payload);

    const expireTimeInSeconds = 60 * 60; // 1 Hour

    setCookie(undefined, "knock-bank.token", accessToken, {
      maxAge: expireTimeInSeconds,
    });

    setIsAuth(true);
  }

  async function logout() {
    await authService.logout();
    destroyCookie(undefined, "knock-bank.token");
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
