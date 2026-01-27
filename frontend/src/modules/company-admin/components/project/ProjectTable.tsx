import type { Project } from "../../types/project.types";

interface ProjectTableProps {
  projects: Project[];
  onView: (projectId: string) => void;
  onDelete: (projectId: string) => void;
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
  onDelete,
}: ProjectTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Project List
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Project Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 transition"
              >
                {/* Project Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {project.name}
                  </div>
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description || "-"}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>

                {/* Start Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* End Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => onView(project.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onDelete(project.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No projects found.
        </div>
      )}
    </div>
  );
};
