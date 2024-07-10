import { API_URL, Api, ApiResponse } from "@/lib/api";
import {
  BasicTransferencePayload,
  TransferencePayload,
} from "@/modules/transaction/schemas/transference";
import {
  Transaction,
  TransactionMonthResume,
} from "@/modules/transaction/schemas/transaction";
import { PaginationResponse } from "@/lib/pagination";

export class TransactionService {
  constructor(private api: Api = new Api()) {}

  async getMyTransactions(): Promise<PaginationResponse<Transaction>> {
    const data = this.api.get<PaginationResponse<Transaction>>(
      `${API_URL}/transaction`
    );
    return data;
  }

  async getAccountResume(): Promise<TransactionMonthResume[]> {
    const data = this.api.get<TransactionMonthResume[]>(
      `${API_URL}/transaction/resume`
    );
    return data;
  }

  async deposit(transference: BasicTransferencePayload): Promise<ApiResponse> {
    const data = this.api.post<ApiResponse, BasicTransferencePayload>(
      `${API_URL}/transaction/deposit`,
      transference
    );
    return data;
  }

  async withdraw(transference: BasicTransferencePayload): Promise<ApiResponse> {
    const data = this.api.post<ApiResponse, BasicTransferencePayload>(
      `${API_URL}/transaction/withdraw`,
      transference
    );
    return data;
  }

  async transfer(transference: TransferencePayload): Promise<ApiResponse> {
    const data = this.api.post<ApiResponse, TransferencePayload>(
      `${API_URL}/transaction/transfer`,
      transference
    );
    return data;
  }
}
