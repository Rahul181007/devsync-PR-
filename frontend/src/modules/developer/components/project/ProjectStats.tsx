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
      {/* Total */}
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-600">Total Projects</p>
        <p className="text-2xl font-semibold">{totalProjects}</p>
      </div>

      {/* Active */}
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-600">Active Projects</p>
        <p className="text-2xl font-semibold">{activeProjects}</p>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-600">Completed Projects</p>
        <p className="text-2xl font-semibold">{completedProjects}</p>
      </div>
    </div>
  );
};
