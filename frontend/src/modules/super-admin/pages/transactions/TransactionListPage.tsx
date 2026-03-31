import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { fetchTransactions, setFromDate, setToDate } from "../../store/transaction.slice";
import { useDebounce } from "../../../../core/hooks/useDebounce";
import TransactionTable from "../../components/transactions/TransactionTable";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    CalendarIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import type { Transaction } from "../../typess/transaction.type";
import TransactionDetailsModal from "../../components/transactions/TransactionDetailsModal";

const TransactionListPage = () => {
    const dispatch = useAppDispatch();

    const { items, page, limit, total, loading, fromDate, toDate } = useAppSelector((state) => state.transaction);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "SUCCESS" | "FAILED">("ALL");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        dispatch(
            fetchTransactions({
                page,
                limit,
                search: debouncedSearch,
                status: statusFilter,
                fromDate,
                toDate
            })
        );
    }, [dispatch, page, limit, debouncedSearch, statusFilter, fromDate, toDate]);

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        dispatch(
            fetchTransactions({
                page: newPage,
                limit,
                search: debouncedSearch,
                status: statusFilter,
                fromDate,
                toDate
            })
        );
    };

    const handleRowClick = (t: Transaction) => {
        setSelectedTransaction(t);
        setIsModalOpen(true);
    };

    const handleClearFilters = () => {
        dispatch(setFromDate(""));
        dispatch(setToDate(""));
        setStatusFilter("ALL");
        setSearch("");
    };

    const hasActiveFilters = fromDate || toDate || statusFilter !== "ALL" || search;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 p-6 lg:p-8">

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Transactions
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitor all payments and invoices
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by company, plan, or invoice..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full sm:w-72 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-3 hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                                >
                                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Date Range Filter Group */}
                        <div className="flex gap-2 items-center bg-white rounded-xl border border-gray-200 p-1">
                            <div className="relative">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => dispatch(setFromDate(e.target.value))}
                                    className="px-3 py-2 pl-9 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200"
                                    placeholder="From date"
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <span className="text-gray-400 text-sm">→</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => dispatch(setToDate(e.target.value))}
                                    className="px-3 py-2 pl-9 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200"
                                    placeholder="To date"
                                />
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as "ALL" | "PENDING" | "SUCCESS" | "FAILED"
                                    )
                                }
                                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                            >
                                <option value="ALL">All Status</option>
                                <option value="SUCCESS">Success</option>
                                <option value="FAILED">Failed</option>
                                <option value="PENDING">Pending</option>
                            </select>
                            <FunnelIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 border border-gray-200"
                            >
                                <XMarkIcon className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {fromDate && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                From: {new Date(fromDate).toLocaleDateString()}
                                <button
                                    onClick={() => dispatch(setFromDate(""))}
                                    className="hover:bg-blue-100 rounded-full p-0.5 ml-1"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {toDate && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                To: {new Date(toDate).toLocaleDateString()}
                                <button
                                    onClick={() => dispatch(setToDate(""))}
                                    className="hover:bg-blue-100 rounded-full p-0.5 ml-1"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {statusFilter !== "ALL" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter("ALL")}
                                    className="hover:bg-blue-100 rounded-full p-0.5 ml-1"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {search && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                Search: {search}
                                <button
                                    onClick={() => setSearch("")}
                                    className="hover:bg-blue-100 rounded-full p-0.5 ml-1"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={handleClearFilters}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Success Rate</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {total > 0 ? Math.round((items.filter(t => t.status === "SUCCESS").length / total) * 100) : 0}%
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {items.reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} {items[0]?.currency || 'INR'}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Current Page</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{page} / {totalPages || 1}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200">
                <TransactionTable
                    transactions={items}
                    loading={loading}
                    onRowClick={handleRowClick}
                />

                <TransactionDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    transaction={selectedTransaction}
                />
            </div>

            {/* Pagination Section */}
            {totalPages > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-900">{((page - 1) * limit) + 1}</span> to{' '}
                        <span className="font-medium text-gray-900">{Math.min(page * limit, total)}</span> of{' '}
                        <span className="font-medium text-gray-900">{total}</span> transactions
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${page === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }
              `}
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="hidden sm:flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`
                      w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                      ${pageNum === page
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${page === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }
              `}
                        >
                            Next
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Overlay for Refreshes */}
            {loading && items.length === 0 && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
                        <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600 font-medium">Loading transactions...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionListPage;