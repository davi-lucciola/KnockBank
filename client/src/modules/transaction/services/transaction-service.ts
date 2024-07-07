import { API_URL, Api, ApiResponse } from "@/lib/api";
import { Transaction } from "@/modules/transaction/schemas/transaction";
import { TransactionMonthResume } from "@/modules/transaction/schemas/transaction-month-resume";
import {
  BasicTransferencePayload,
  TransferencePayload,
} from "../schemas/transference";

export class TransactionService {
  constructor(private api: Api = new Api()) {}

  async getMyTransactions(): Promise<Transaction[]> {
    const data = this.api.get<Transaction[]>(`${API_URL}/transaction`);
    return data;
  }

  async getAccountResume(): Promise<TransactionMonthResume[]> {
    const data = this.api.get<TransactionMonthResume[]>(
      `${API_URL}/transaction/resume`
    );
    return data;
  }

  async deposit(transference: BasicTransferencePayload) {
    const data = this.api.post<ApiResponse, BasicTransferencePayload>(
      `${API_URL}/transaction/deposit`,
      transference
    );
    return data;
  }

  async withdraw(transference: BasicTransferencePayload) {
    const data = this.api.post<ApiResponse, BasicTransferencePayload>(
      `${API_URL}/transaction/withdraw`,
      transference
    );
    return data;
  }

  async transfer(transference: TransferencePayload) {
    const data = this.api.post<ApiResponse, TransferencePayload>(
      `${API_URL}/transaction/transfer`,
      transference
    );
    return data;
  }
}
