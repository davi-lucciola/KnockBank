import { API_URL, Api, ApiResponse } from "@/lib/api";
import { Transaction } from "../schemas/transaction";

export class TransactionService {
  constructor(private api: Api = new Api()) {}

  async getMyTransactions(): Promise<Transaction[]> {
    const data = this.api.get<Transaction[]>(`${API_URL}/transaction`);
    return data;
  }

  async deposit() {}

  async withdraw() {}

  async transfer() {}
}
