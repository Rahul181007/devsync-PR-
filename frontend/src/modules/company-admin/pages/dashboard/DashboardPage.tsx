import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { getCompanyDashboard } from "../../store/dashboard.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import WorklogChart from "../../components/dashboard/WorklogChart";
import ProjectHealth from "../../components/dashboard/ProjectHealth";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

const CompanyDashboardPage = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.companyAdminDashboard)

    useEffect(() => {
        dispatch(getCompanyDashboard())
    }, [dispatch])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-sm font-medium text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Welcome back! Here's what's happening with your projects today.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Updates
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-8">
                    <DashboardGrid data={data} />
                </div>

                {/* Charts Section */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Task Status Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">Task Status Distribution</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Current task breakdown by status</p>
                            </div>
                            <div className="p-6">
                                <TaskStatusChart data={data} />
                            </div>
                        </div>

                        {/* Worklog Trend Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">Worklog Trends</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Hours logged over time</p>
                            </div>
                            <div className="p-6">
                                <WorklogChart data={data.worklogTrend} />
                            </div>
                        </div>

                        {/* Project Health Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 lg:col-span-2">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">Project Health Overview</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Status and progress of all active projects</p>
                            </div>
                            <div className="p-6">
                                <ProjectHealth data={data.projectHealth || []} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Latest updates from your team</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Live Feed
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <ActivityFeed data={data.activityFeed || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDashboardPage
