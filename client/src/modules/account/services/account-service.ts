import { API_URL, Api, ApiResponse } from "@/lib/api";
import { CreateAccountPayload } from "../schemas/create-account";
import { Account } from "@/models/account";

export class AccountService {
  constructor(private api: Api = new Api()) {}

  async getCurrentAccount() {
    const data = this.api.get<Account>(`${API_URL}/account/me`);
    return data;
  }

  async createAccount(payload: CreateAccountPayload): Promise<ApiResponse> {
    const data = this.api.post<ApiResponse, CreateAccountPayload>(
      `${API_URL}/account`,
      payload
    );
    return data;
  }
}