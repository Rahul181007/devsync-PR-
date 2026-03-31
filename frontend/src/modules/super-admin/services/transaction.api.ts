import { http } from "../../../core/api/http";

export interface GetTransactionsParams {
  page: number;
  limit: number;
  search?: string;
  status?: "PENDING" | "SUCCESS" | "FAILED";
}

export const transactionApi = {
  getTransactions(params: GetTransactionsParams) {
    return http.get("/superadmin/transactions", { params });
  },

  downloadInvoice(invoiceId: string) {
  return http.get(`/superadmin/invoices/${invoiceId}/download`, {
    responseType: "blob"
  });
}
};