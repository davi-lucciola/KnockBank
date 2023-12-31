import React, { createContext, useState } from "react";
import { Conta } from "../data/models/Conta";
import { ContaService, IContaService } from "../data/services/ContaService";


interface IContaContext {
  getConta(): Conta | null
  setConta(conta: Conta): void
  getContaService(): IContaService
}

export const ContaContext = createContext({} as IContaContext);
export function ContaContextProvider({ children }: { children: React.ReactNode }) {
  const [contaData, setContaData] = useState<Conta | null>(null);

  function getContaService(): IContaService {
    return new ContaService();
  }

  function getConta(): Conta | null{
    return contaData;
  }

  function setConta(conta: Conta) {
    setContaData(conta);
  }

  return (
    <ContaContext.Provider value={{ getConta, setConta, getContaService }}>
      {children}
    </ContaContext.Provider>
  )
}