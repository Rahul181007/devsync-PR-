import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useEffect, useState } from "react";
import { fetchProjectDetail } from "../../store/project.slice";
import DevProjectMembers from "../../components/project/DevProjectMembers";
import DeveloperTaskBoard from "../../components/task/DeveloperTaskBoard";

/* ================= Types ================= */

type ProjectDetailTab =
  | "TASKS"
  | "CHAT"
  | "FILES"
  | "COMMENTS"
  | "AI";

const TABS: { key: ProjectDetailTab; label: string }[] = [
  { key: "TASKS", label: "Tasks" },
  { key: "CHAT", label: "Chat" },
  { key: "FILES", label: "Files" },
  { key: "COMMENTS", label: "Comments" },
  { key: "AI", label: "AI Summary" },
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

  if (loading) return <p className="p-6">Loading project...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!selectedProject) return null;

  const project = selectedProject;

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

      {/* ================= Tabs ================= */}
      <div className="border-b flex gap-6 text-sm font-medium">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= Tab Content ================= */}
      {activeTab === "TASKS" && projectId && (
        <DeveloperTaskBoard projectId={projectId} />
      )}

      {activeTab !== "TASKS" && (
        <div className="text-sm text-gray-500 py-10 text-center">
          Coming soon
        </div>
      )}
    </div>
  );
};

export default DevProjectDetailPage;
