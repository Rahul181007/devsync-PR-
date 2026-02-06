import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useEffect } from "react";
import { fetchProjectDetail } from "../../store/project.slice";
import DevProjectMembers from "../../components/project/DevProjectMembers";

export const DevProjectDetailPage=()=>{
    const {projectId}=useParams<{projectId:string}>();
    const dispatch=useAppDispatch();

    const {selectedProject,loading,error}=useAppSelector((state)=>state.developerProjects);

    useEffect(()=>{
        if(projectId){
            dispatch(fetchProjectDetail(projectId))
        }
    },[dispatch,projectId])

      if (loading) return <p className="p-6">Loading project...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!selectedProject) return null;

  const project = selectedProject;

    return (
    <div className="p-6 space-y-6">
      {/* ================= Project Header Card ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {project.description || "—"}
          </p>
        </div>

        {/* ================= Project Meta ================= */}
        <div className="grid grid-cols-4 gap-6 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">
              {project.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium text-gray-900">
              {project.startDate ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium text-gray-900">
              {project.endDate ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Team</p>
            <DevProjectMembers members={project.members} />
          </div>
        </div>
      </div>
    </div>
  );
};