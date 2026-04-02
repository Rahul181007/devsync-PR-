import DashboardCard from "./DashboardCard";
import type { CompanyDashboardData } from "../../types/dashboard.types";

interface Props {
  data: CompanyDashboardData;
}

const DashboardGrid = ({ data }: Props) => {
  // Define card categories with their visual indicators
  const cards = [
    { title: "Total Projects", value: data.totalProjects, category: "projects" },
    { title: "Active Projects", value: data.activeProjects, category: "projects" },
    { title: "Total Developers", value: data.totalDevelopers, category: "developers" },
    { title: "Active Developers", value: data.activeDevelopers, category: "developers" },
    { title: "Total Tasks", value: data.totalTasks, category: "tasks" },
    { title: "Completed Tasks", value: data.completedTasks, category: "tasks" },
    { title: "Overdue Tasks", value: data.overdueTasks, category: "tasks" },
    { title: "Blocked Developers", value: data.blockedDevelopers, category: "blocked" },
  ];

  // Category background colors
  const getCategoryBg = (category: string) => {
    switch (category) {
      case "projects": return "bg-blue-50/30";
      case "developers": return "bg-purple-50/30";
      case "tasks": return "bg-orange-50/30";
      case "blocked": return "bg-red-50/30";
      default: return "bg-gray-50/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive grid with visual grouping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className={`relative ${getCategoryBg(card.category)} rounded-xl transition-all duration-200`}
            style={{
              animation: `fadeInUp 0.3s ease-out ${index * 0.05}s forwards`,
              opacity: 0,
            }}
          >
            {/* Category indicator line */}
            <div
              className={`absolute top-0 left-4 right-4 h-0.5 rounded-full ${
                card.category === "projects"
                  ? "bg-linear-to-r from-blue-400 to-blue-600"
                  : card.category === "developers"
                  ? "bg-linear-to-r from-purple-400 to-purple-600"
                  : card.category === "tasks"
                  ? "bg-linear-to-r from-orange-400 to-orange-600"
                  : "bg-linear-to-r from-red-400 to-red-600"
              }`}
            />
            <DashboardCard title={card.title} value={card.value} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardGrid;