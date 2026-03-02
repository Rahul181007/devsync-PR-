import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearAISummary, getProjectAISummary } from "../store/ai.slice";
import Spinner from "../../../shared/components/LoadingSpinner";

interface Props{
    projectId:string;
}

const ProjectAISummary=({projectId}:Props)=>{
     const dispatch=useAppDispatch();
     
     const {summary ,loading,error}=useAppSelector((state)=>state.ai)

     useEffect(()=>{
        if(!projectId) return;
        dispatch(getProjectAISummary({projectId}));

        return ()=>{
            dispatch(clearAISummary())
        }
     },[dispatch,projectId])
 if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-linear-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3">
        AI-Powered Insights
      </h2>

      <p className="text-sm opacity-90 mb-4">
        {summary.summary}
      </p>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p>Total Tasks</p>
          <p className="font-bold">{summary.totalTasks}</p>
        </div>

        <div>
          <p>Overdue</p>
          <p className="font-bold">{summary.overdueTasks}</p>
        </div>

        <div>
          <p>Velocity</p>
          <p className="font-bold">
            {summary.velocity} /day
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectAISummary;