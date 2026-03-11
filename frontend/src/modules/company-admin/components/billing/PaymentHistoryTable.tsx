import type { PaymentHistory } from "../../types/billing.types"
import { Calendar, CreditCard, Download, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { useState } from "react";

interface Props{
    payments:PaymentHistory[]
}

const PaymentHistoryTable = ({ payments }: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!payments.length) {
    return (
      <div className="bg-linear-to-br from-white to-gray-50/50 border border-gray-200 rounded-xl p-8 text-gray-500 text-sm flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No payment history available</p>
        <p className="text-xs text-gray-400">Your recent payments will appear here</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "SUCCESS":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "FAILED":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "SUCCESS":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          light: "bg-emerald-100/50"
        };
      case "FAILED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          light: "bg-red-100/50"
        };
      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          light: "bg-amber-100/50"
        };
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      short: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.toLocaleDateString('en-US', { year: 'numeric' })
    };
  };

  const handleDownloadInvoice = (payment: PaymentHistory) => {
    // Mock download functionality - you can implement actual download logic here
    console.log('Downloading invoice for payment:', payment.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Header with gradient */}
      <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <CreditCard className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Payment History</h3>
              <p className="text-xs text-gray-500">Your recent transactions and invoices</p>
            </div>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
            {payments.length} {payments.length === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>
      </div>

      {/* Table - Modern Design */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          
          {/* Table Header - Enhanced */}
          <thead className="bg-gray-50/80">
            <tr>
              <th className="text-left px-6 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Date
                </div>
              </th>
              <th className="text-left px-6 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Billing Cycle
                </div>
              </th>
              <th className="text-left px-6 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  Amount
                </div>
              </th>
              <th className="text-left px-6 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </div>
              </th>
              <th className="text-right px-6 py-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body - Enhanced */}
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment, index) => {
              const dateFormatted = formatDate(payment.createdAt);
              const statusColors = getStatusColor(payment.status);
              const isExpanded = expandedRow === payment.id;

              return (
                <tr
                  key={payment.id}
                  onClick={() => setExpandedRow(isExpanded ? null : payment.id)}
                  className={`group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer ${
                    index === 0 ? 'bg-linear-to-r from-indigo-50/30 to-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Calendar Icon for Date */}
                      <div className={`w-8 h-8 rounded-lg ${statusColors.light} flex flex-col items-center justify-center border ${statusColors.border}`}>
                        <span className={`text-[10px] font-bold ${statusColors.text} leading-none`}>
                          {dateFormatted.month}
                        </span>
                        <span className={`text-xs font-bold ${statusColors.text} leading-none`}>
                          {dateFormatted.day}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {dateFormatted.short}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dateFormatted.year}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        payment.billingCycle === "MONTHLY" 
                          ? "bg-blue-50 text-blue-700 border-blue-200" 
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}>
                        {payment.billingCycle}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatAmount(payment.amount, payment.currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.currency}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoice(payment);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with summary */}
      <div className="bg-linear-to-r from-gray-50 to-white px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">Success</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Failed</span>
            </div>
          </div>
          <div className="text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;