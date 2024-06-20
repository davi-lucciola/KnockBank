import { API_LOCAL_URL, Api, ApiResponse } from "@/api";
import { CreateAccountPayload } from "../schemas/create-account";
import { Account } from "@/models/account";

export class AccountService {
  constructor(private api: Api = new Api()) {}

  async getCurrentAccount() {
    const data = this.api.get<Account>(`${API_LOCAL_URL}/account/me`)
    return data
  }

  async createAccount(payload: CreateAccountPayload): Promise<ApiResponse> {
    const data = this.api.post<ApiResponse, CreateAccountPayload>(
      `${API_LOCAL_URL}/account`,
      payload
    );
    return data;
  }
}
