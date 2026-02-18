import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getProjectDetail } from "../../store/project.slice";
import ProjectMembers from "../../components/project/ProjectMembers";
import { ProjectMembersModal } from "../../components/project/ProjectMembersModal";
import { EditProjectModal } from "../../components/project/EditProjectModal";
import ProjectTasksPage from "./ProjectTasksPage";
import { SprintBoard } from "../../components/sprint/SprintBoard";

/* ================= Types ================= */
type ProjectDetailTab = "TASKS" | "CHAT" | "SPRINT";

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const { selectedProject, loading, error } = useAppSelector(
    (state) => state.project
  );

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [membersModalMode, setMembersModalMode] =
    useState<"VIEW" | "ADD">("VIEW");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [activeTab, setActiveTab] =
    useState<ProjectDetailTab>("TASKS");

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectDetail(projectId));
    }
  }, [dispatch, projectId]);

  if (loading) return <p className="p-6">Loading project...</p>;
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
        <div className="flex justify-between items-start">
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

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              Edit Project
            </button>

            <button
              onClick={() => {
                setMembersModalMode("ADD");
                setIsMembersModalOpen(true);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              + Members
            </button>
          </div>
        </div>

        {/* ================= Meta ================= */}
        <div className="grid grid-cols-4 gap-6 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{project.status}</p>
          </div>

          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">
              {project.startDate ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium">
              {project.endDate ?? "—"}
            </p>
          </div>

          <div
            onClick={() => {
              setMembersModalMode("VIEW");
              setIsMembersModalOpen(true);
            }}
            className="cursor-pointer"
          >
            <p className="text-gray-500">Team</p>
            <ProjectMembers members={project.members} />
          </div>
        </div>
      </div>

      {/* ================= Tabs ================= */}
      <div className="border-b flex gap-6 px-2">
        {(["TASKS", "CHAT", "SPRINT"] as ProjectDetailTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ================= Tab Content ================= */}
      {activeTab === "TASKS" && (
        <ProjectTasksPage projectId={project.id} />
      )}

      {activeTab === "CHAT" && (
        <div className="p-6 text-gray-500">
          Chat coming soon
        </div>
      )}

      {activeTab === "SPRINT" && (
        <SprintBoard projectId={project.id} />
      )}

      {/* ================= Modals ================= */}
      <ProjectMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        projectId={project.id}
        mode={membersModalMode}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={project.id}
      />
    </div>
  );
};

export default ProjectDetailPage;

