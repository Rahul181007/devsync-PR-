import { useAppDispatch } from "../../../../store/hook";
import { downloadInvoice } from "../../store/transaction.slice";
import type { Transaction } from "../../typess/transaction.type";
import { XMarkIcon, DocumentArrowDownIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const TransactionDetailsModal = ({ isOpen, onClose, transaction }: Props) => {
    const dispatch = useAppDispatch();
    
    if (!isOpen || !transaction) return null;

    const handleDownload = async () => {
        if (!transaction?.invoiceId) return;

        const res = await dispatch(downloadInvoice(transaction.invoiceId));

        if (downloadInvoice.fulfilled.match(res)) {
            const blob = res.payload;

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${transaction.invoiceId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const getStatusConfig = (status: string) => {
        switch(status) {
            case "SUCCESS":
                return { icon: CheckCircleIcon, color: "text-green-600", bg: "bg-green-50", label: "Success" };
            case "FAILED":
                return { icon: XCircleIcon, color: "text-red-600", bg: "bg-red-50", label: "Failed" };
            case "PENDING":
                return { icon: ClockIcon, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" };
            default:
                return { icon: null, color: "text-gray-600", bg: "bg-gray-50", label: status };
        }
    };

    const statusConfig = getStatusConfig(transaction.status);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Transaction Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Company Info */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Company</span>
                        <span className="font-medium text-gray-900">{transaction.companyName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Plan</span>
                        <span className="font-medium text-gray-900">{transaction.planName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Billing</span>
                        <span className="font-medium text-gray-900">{transaction.billingCycle}</span>
                    </div>

                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Amount Details */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Subtotal</span>
                        <span className="text-gray-900">
                            {transaction.subtotal ?? 0} {transaction.currency}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Tax</span>
                        <span className="text-gray-900">
                            {transaction.tax ?? 0} {transaction.currency}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">
                            {transaction.total ?? transaction.amount} {transaction.currency}
                        </span>
                    </div>

                    <div className="border-t border-gray-100 my-2"></div>

                    {/* Status & Additional Info */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.icon && <statusConfig.icon className="w-3 h-3" />}
                            {statusConfig.label}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Invoice</span>
                        <span className="font-mono text-xs text-gray-900">
                            {transaction.invoiceNumber ?? "-"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="text-sm text-gray-900">
                            {new Date(transaction.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 space-y-2">
                    {transaction.invoiceId && (
                        <button
                            onClick={handleDownload}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            Download Invoice
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;