import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";

export interface GetTransactionsParams {
  page: number;
  limit: number;
  search?: string;
  status?: "PENDING" | "SUCCESS" | "FAILED";
}

export const transactionApi = {
  getTransactions(params: GetTransactionsParams) {
    return http.get(API_ROUTES.SUPER_ADMIN.TRANSACTIONS, { params });
  },

  downloadInvoice(invoiceId: string) {
  return http.get(API_ROUTES.SUPER_ADMIN.DOWNLOAD_INVOICE(invoiceId), {
    responseType: "blob"
  });
}
};