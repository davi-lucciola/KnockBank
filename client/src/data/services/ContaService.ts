import { Api, apiError } from "../Api";
import { AxiosInstance } from "axios";
import { ContaIn } from "../schemas/Conta";


export interface IContaService {
  cadastrarConta(conta: ContaIn): Promise<any>
}

export class ContaService implements IContaService {
  api: AxiosInstance

  constructor() {
    this.api = Api();
  }

  async cadastrarConta(conta: ContaIn): Promise<any> {
    try {
      const response = await this.api.post('/conta', conta);
      return response.data;
    } catch (e: any) {
      apiError(e);
    }
  }
}