import type { Project } from "../../types/project.types";

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats = ({ projects }: ProjectStatsProps) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "ACTIVE"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Projects */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-50">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Projects</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totalProjects}
            </p>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-50">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Active Projects</p>
            <p className="text-2xl font-semibold text-gray-900">
              {activeProjects}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-50">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Completed Projects</p>
            <p className="text-2xl font-semibold text-gray-900">
              {completedProjects}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
