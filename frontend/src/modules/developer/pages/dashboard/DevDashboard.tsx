import { useEffect } from "react";
import Spinner from "../../../../shared/components/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import StatsCards from "../../components/dashboard/StatsCards";
import TaskList from "../../components/dashboard/TaskList";
import { getDeveloperDashboard } from "../../store/dashboard.slice";
import WorklogChart from "../../components/dashboard/WorklogChart";

const DevDashboard = () => {
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector((state) => state.developerDashboard);

  useEffect(() => {
    dispatch(getDeveloperDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 shadow-sm">
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* 🔹 Page Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Developer Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your tasks, activity, and progress
          </p>
        </div>

        {/* 🔹 Stats Cards */}
        <StatsCards stats={data.stats} />

        {/* 🔹 Tasks + Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <TaskList tasks={data.tasks} />
          </div>

          {/* Activity Feed Section */}
          <ActivityFeed activity={data.recentActivity} />
        </div>

        {/* 🔹 Worklog Chart Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Worklog Overview
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Last 7 days activity
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Hours logged</span>
            </div>
          </div>

          <div className="h-64 md:h-72">
            <WorklogChart data={data.worklogChart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;