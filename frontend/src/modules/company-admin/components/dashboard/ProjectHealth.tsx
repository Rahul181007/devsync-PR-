import { useNavigate, useParams } from "react-router-dom";
import type { ProjectHealthItem } from "../../types/dashboard.types";

interface Props {
    data: ProjectHealthItem[]
}

const getColor = (health: number) => {
    if (health >= 80) return "from-green-500 to-green-600";
    if (health >= 50) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600"
}

const getStatusText = (health: number) => {
    if (health >= 80) return "Excellent";
    if (health >= 50) return "At Risk";
    return "Critical"
}

const getStatusBadgeColor = (health: number) => {
    if (health >= 80) return "bg-green-100 text-green-700";
    if (health >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700"
}

const ProjectHealth = ({ data }: Props) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    if (!data || data.length === 0) {
        return (
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 h-80 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-medium">No project data available</p>
                    <p className="text-sm text-gray-300 mt-1">Projects will appear here</p>
                </div>
            </div>
        )
    }


    const sortedProjects = [...data].sort((a, b) => a.health - b.health);

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 h-80 overflow-y-auto">
            {/* Header with gradient accent */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Project Health
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">Real-time project metrics</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="mr-2">Good</span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="mr-2">Risk</span>
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Critical</span>
                    </div>
                </div>
            </div>

            <div className="space-y-5 p-6 pt-4">
                {sortedProjects.map((project, index) => (
                    <div
                        key={project.projectId}
                        className={`group ${index === 0 ? "bg-red-50 p-2 rounded-lg" : ""}`}
                    >
                        {/* Header with status badge */}
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className={`w-2 h-2 rounded-full ${getColor(project.health).split(' ')[1].replace('from-', 'bg-').replace('-600', '-500')}`}></div>
                                <span className="font-semibold text-gray-800 truncate group-hover:text-gray-900 transition-colors">
                                    {project.projectName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(project.health)}`}>
                                    {getStatusText(project.health)}
                                </span>
                                <span className="text-sm font-bold text-gray-700 tabular-nums">
                                    {project.health}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar with glow effect */}
                        <div className="relative">
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                                <div
                                    className={`h-2.5 rounded-full bg-gradient-to-r ${getColor(project.health)} transition-all duration-500 ease-out`}
                                    style={{ width: `${project.health}%` }}
                                >
                                    <div className="w-full h-full bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with detailed stats */}
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="font-medium text-gray-600">{project.completedTasks}</span>
                                    <span className="text-gray-400">/ {project.totalTasks} tasks</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <span className="text-gray-600">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</span>
                                    <span className="text-gray-400">complete</span>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    navigate(`/company/${slug}/projects/${project.projectId}`)
                                }
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Details →
                            </button>
                        </div>

                        {/* Subtle separator (except last item) */}
                        {index !== data.length - 1 && (
                            <div className="mt-4 border-t border-gray-100"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectHealth;