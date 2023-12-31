import { AxiosInstance } from "axios";
import { UserLogin } from "../schemas/User";
import { Api, apiError } from "../Api";

export interface IAuthService {
  login(user_login: UserLogin): Promise<any>
}

export class AuthService implements IAuthService {
  api: AxiosInstance

  constructor() {
    this.api = Api();
  }

  async login(user_login: UserLogin): Promise<any> {
    try {
      const response = await this.api.post('/login', user_login);
      return response.data;
    } catch (e: any) {
      apiError(e);
    }
  }
}