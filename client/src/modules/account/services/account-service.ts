import { API_URL, Api, ApiResponse } from "@/lib/api";
import { CreateAccountPayload } from "../schemas/create-account";
import { Account, BaseAccount } from "@/modules/account/schemas/account";
import { QueryAccount } from "@/modules/account/schemas/query-account";

export class AccountService {
  constructor(private api: Api = new Api()) {}

  async getAccounts(query: QueryAccount) {
    const urlParams = new URLSearchParams({
      limit: query.limit.toString(),
      offset: query.offset.toString(),
      search: query.search,
    });

    const data = this.api.get<BaseAccount[]>(`${API_URL}/account`, urlParams);
    return data;
  }

  async getCurrentAccount(): Promise<Account> {
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
