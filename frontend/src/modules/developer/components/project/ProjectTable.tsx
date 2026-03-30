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
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Project
              </th>
              <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  {project.name}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onView(project.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          No projects assigned.
        </div>
      )}
    </div>
  );
};
