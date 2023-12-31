import React, { createContext, useState } from "react"
import { AuthService, IAuthService } from "../data/services/AuthService";

type AuthContextProps = {
  isAuthenticated: boolean
};

interface IAuthContext {
  isAuth(): boolean
  setToken(token: string): void
  removeToken(): void
  getAuthService(): IAuthService
}

export const AuthContext = createContext({} as IAuthContext);
export function AuthContextProvider({ children }: { children: React.ReactNode} ) {
  const [authContextData, setAuthContextData] = useState<AuthContextProps>({ isAuthenticated: !!getToken()  });

  function getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  function setToken(token: string): void {
    localStorage.setItem('token', token);
    setAuthContextData({ isAuthenticated: true })
  }

  function isAuth(): boolean {
    return authContextData.isAuthenticated
  }

  function removeToken() {
    localStorage.removeItem('token')
    setAuthContextData({ isAuthenticated: false })
  }

  function getAuthService(): IAuthService {
    return new AuthService();
  }

  return (
    <AuthContext.Provider value={{ isAuth, setToken, removeToken, getAuthService }} >
      {children}
    </AuthContext.Provider>
  )
}