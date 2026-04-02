import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { getCompanyDashboard } from "../../store/dashboard.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import WorklogChart from "../../components/dashboard/WorklogChart";


const CompanyDashboardPage = () => {
    const dispatch=useAppDispatch();

    const {data,loading,error}=useAppSelector((state)=>state.companyAdminDashboard)

    useEffect(()=>{
        dispatch(getCompanyDashboard())
    },[dispatch])

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

      if (error) return <p className="p-6 text-red-500">{error}</p>;

  if (!data) return null;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      <DashboardGrid data={data} />

      <div className="mt-6 grid grid-cols-2 gap-4">
  <TaskStatusChart data={data} />
  <WorklogChart data={data.worklogTrend} />
</div>
    </div>
  )
}

export default CompanyDashboardPage
