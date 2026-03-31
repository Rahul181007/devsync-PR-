import Spinner from "../../../../shared/components/LoadingSpinner";
import type { Transaction } from "../../typess/transaction.type";

interface Props {
    transactions: Transaction[];
    loading: boolean;
    onRowClick?: (transaction: Transaction) => void;
}

const TransactionTable = ({ transactions, loading,onRowClick }: Props) => {
    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                <p className="text-sm text-gray-500 mt-1">Monitor all payments and invoices</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Company
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Plan
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Invoice
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((t) => (
                            <tr
  key={t.paymentId}
  onClick={() => onRowClick?.(t)}
  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
>
                                {/* Company */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs font-semibold">
                                                {t.companyName?.charAt(0).toUpperCase() || 'C'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {t.companyName || '-'}
                                        </span>
                                    </div>
                                </td>

                                {/* Plan */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-700">
                                        {t.planName || '-'}
                                    </span>
                                </td>

                                {/* Amount */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {t.amount} {t.currency}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                        ${t.status === "SUCCESS"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : t.status === "FAILED"
                                                ? "bg-red-50 text-red-700 border border-red-200"
                                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                        }
                                    `}>
                                        <span className={`
                                            w-1.5 h-1.5 rounded-full mr-1.5
                                            ${t.status === "SUCCESS" ? "bg-green-500" :
                                                t.status === "FAILED" ? "bg-red-500" :
                                                    "bg-yellow-500"}
                                        `}></span>
                                        {t.status === "SUCCESS" ? "Success" :
                                            t.status === "FAILED" ? "Failed" :
                                                t.status}
                                    </span>
                                </td>

                                {/* Invoice */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {t.invoiceNumber ? (
                                        <span className="text-sm text-blue-600 font-mono">
                                            {t.invoiceNumber}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-400">—</span>
                                    )}
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600">
                                        {new Date(t.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {transactions.length === 0 && !loading && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No transactions found</p>
                </div>
            )}
        </div>
    );
};

export default TransactionTable;