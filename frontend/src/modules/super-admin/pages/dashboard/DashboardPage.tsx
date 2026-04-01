import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { getDashboard } from "../../store/dashboard.slice";
import StatsCards from "../../components/dashboard/StatsCards";
import RevenueCharts from "../../components/dashboard/RevenueChart";
import PlanChart from "../../components/dashboard/PlanChart";
import Spinner from "../../../../shared/components/LoadingSpinner";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.superAdminDashboard);

    useEffect(() => {
        dispatch(getDashboard())
    }, [dispatch])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Welcome back! Here's what's happening with your platform today.
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
                {/* Stats Cards Section */}
                <div>
                    <StatsCards stats={data?.stats} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                            <p className="text-sm text-gray-500 mt-1">Monthly revenue trends</p>
                        </div>
                        <RevenueCharts data={data?.revenueChart || []} />
                    </div>

                    {/* Plan Distribution Chart Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Plan Distribution</h2>
                            <p className="text-sm text-gray-500 mt-1">User subscription breakdown</p>
                        </div>
                        <PlanChart data={data?.planDistribution || []} />
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <RecentTransactions />
                </div>

                {/* Footer Stats */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>Total Companies: {data?.stats?.totalCompanies || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span>Active: {data?.stats?.activeCompanies || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>Pending: {data?.stats?.pendingCompanies || 0}</span>
                            </span>
                        </div>
                        <div>
                            Data refreshes automatically
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;