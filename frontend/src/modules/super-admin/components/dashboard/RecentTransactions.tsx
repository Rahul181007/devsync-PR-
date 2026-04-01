import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { fetchRecentTransactions } from "../../store/transaction.slice";

const RecentTransactions = () => {
    const dispatch = useAppDispatch();

    const { recentTransactions } = useAppSelector(
        (state) => state.transaction
    );

    useEffect(() => {
        dispatch(fetchRecentTransactions());
    }, [dispatch]);

    return (
        <div className="bg-linear-to-br from-white to-gray-50/50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-lg tracking-tight">Recent Transactions</h3>
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left bg-gray-50/50">
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentTransactions.map((tx, idx) => (
                            <tr key={tx.paymentId} className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors duration-150 ${idx !== recentTransactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <td className="py-3 px-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                            <span className="text-xs font-medium text-blue-600">
                                                {tx.companyName?.charAt(0) || "C"}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-700">{tx.companyName}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-5">
                                    <span className="font-semibold text-gray-900">₹{tx.amount}</span>
                                </td>
                                <td className="py-3 px-5">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                        ${tx.status === "SUCCESS" ? "bg-green-50 text-green-700 ring-1 ring-green-600/20" : ""}
                                        ${tx.status === "FAILED" ? "bg-red-50 text-red-700 ring-1 ring-red-600/20" : ""}
                                        ${tx.status === "PENDING" ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20" : ""}
                                        ${!tx.status || (tx.status !== "SUCCESS" && tx.status !== "FAILED" && tx.status !== "PENDING") ? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20" : ""}
                                    `}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                            tx.status === "SUCCESS" ? "bg-green-500" : 
                                            tx.status === "FAILED" ? "bg-red-500" : 
                                            "bg-yellow-500"
                                        }`}></span>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {recentTransactions.length === 0 && (
                <div className="py-12 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">No recent transactions</p>
                </div>
            )}

            <div className="mt-2 px-5 pb-4 pt-2 border-t border-gray-100 bg-gray-50/30">
                <div className="flex justify-end">
                    <a 
                        href="/super-admin/transactions" 
                        className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors group"
                    >
                        View all 
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;