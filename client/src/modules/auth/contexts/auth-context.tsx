"use client";

import { createContext, useState } from "react";
import { setCookie, destroyCookie } from "nookies";
import { AuthService } from "@/modules/auth/services/auth-service";
import { LoginUserPayload } from "@/modules/auth/schemas/login-user";

interface IAuthContext {
  isAuth: () => boolean;
  loginUser: (payload: LoginUserPayload) => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // function getToken(): string | null {
  //   return localStorage.getItem("token");
  // }

  async function loginUser(payload: LoginUserPayload): Promise<void> {
    const data = await AuthService.login(payload);

    const expireTimeInSeconds = 60 * 60; // 1 Hour

    setCookie(undefined, "knock-bank.token", data.accessToken, {
      maxAge: expireTimeInSeconds,
    });

    setIsAuthenticated(true);
  }

  function isAuth(): boolean {
    return isAuthenticated;
  }

  function removeToken() {
    destroyCookie(undefined, "knock-bank.token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuth, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}
