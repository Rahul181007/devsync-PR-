import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useEffect, useState } from "react";
import { fetchProjectDetail } from "../../store/project.slice";
import DevProjectMembers from "../../components/project/DevProjectMembers";
import DeveloperTaskBoard from "../../components/task/DeveloperTaskBoard";
import DevStandupPanel from "../../components/standup/DevStandupPanel";
import Spinner from "../../../../shared/components/LoadingSpinner";
import ProjectChat from "../../../chat/components/ProjectChat";
import ProjectAISummary from "../../../ai/components/ProjectAISummary";
import MeetingPage from "../Meeting/MeetingPage";



type ProjectDetailTab =
  | "TASKS"
  | "CHAT"
  | "AI"
  | "STANDUP"
  |"MEETINGS";


const TABS: { key: ProjectDetailTab; label: string }[] = [
  { key: "TASKS", label: "Tasks" },
  { key: "CHAT", label: "Chat" },
  { key: "AI", label: "AI Summary" },
  { key: "STANDUP", label: "StandUp" },
  { key: "MEETINGS", label: "Meetings" },
];

/* ================= Page ================= */

export const DevProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const { selectedProject, loading, error } = useAppSelector(
    (state) => state.developerProjects
  );

  const [activeTab, setActiveTab] = useState<ProjectDetailTab>("TASKS");

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetail(projectId));
    }
  }, [dispatch, projectId]);

  if (loading)
    return (
      <div className="p-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!selectedProject) return null;

  const project = selectedProject;
  const isOverdue =
    project.endDate &&
    new Date(project.endDate) < new Date() &&
    project.status !== "COMPLETED";

  return (
    <div className="p-6 space-y-6">
      {/* ================= Project Header ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {project.description || "—"}
          </p>

          {isOverdue && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠ This project has exceeded its planned end date.
              </p>
            </div>
          )}
        </div>

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
              {project.startDate
                ? new Date(project.startDate).toISOString().split("T")[0]
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium text-gray-900">
              {project.endDate
                ? new Date(project.endDate).toISOString().split("T")[0]
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Team</p>
            <DevProjectMembers members={project.members} />
          </div>
        </div>
      </div>

      {/* ================= Tabs ================= */}
      <div className="border-b flex gap-6 text-sm font-medium">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 ${activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= Tab Content ================= */}
      {/* ================= Tab Content ================= */}

      {activeTab === "TASKS" && projectId && (
        <DeveloperTaskBoard projectId={projectId} />
      )}

      {activeTab === "CHAT" && projectId && (
        <ProjectChat projectId={projectId} />
      )}

      {activeTab === "STANDUP" && projectId && (
        <DevStandupPanel projectId={projectId} />
      )}



      {activeTab === "AI" && projectId && (
        <ProjectAISummary projectId={projectId} />
      )}

            {activeTab === "MEETINGS" && projectId && (
        <MeetingPage projectId={projectId} />
      )}

    </div>
  );
};

export default DevProjectDetailPage;
