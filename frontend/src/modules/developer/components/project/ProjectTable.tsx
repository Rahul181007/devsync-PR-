import { Table } from "../../../../shared/components/table";
import type { Project } from "../../types/project.types";

interface ProjectTableProps {
  projects: Project[];
  onView: (projectId: string) => void;
}

const getStatusBadge = (status: Project["status"]) => {
  switch (status) {
    case "ACTIVE":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "ARCHIVED":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const ProjectTable = ({
  projects,
  onView,
}: ProjectTableProps) => {
  return (
   <Table<Project>
      title="My Projects"
      data={projects}
      emptyText="No projects assigned"
      columns={[
        {
          header: "Project",
          render: (project) => (
            <div className="font-medium text-gray-900">
              {project.name}
            </div>
          ),
        },
        {
          header: "Status",
          render: (project) => (
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                project.status
              )}`}
            >
              {project.status}
            </span>
          ),
        },
        {
          header: "Start Date",
          render: (project) =>
            project.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : "-",
        },
        {
          header: "End Date",
          render: (project) =>
            project.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : "-",
        },
        {
          header: "Action",
          render: (project) => (
            <button
              onClick={() => onView(project.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              View
            </button>
          ),
        },
      ]}
    />
  );
};