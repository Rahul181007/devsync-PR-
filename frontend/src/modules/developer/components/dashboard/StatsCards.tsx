import type { DeveloperStats } from "../../types/dashboard.types";
import DeveloperDashboardCard from "./DeveloperDashboardCard";

interface Props {
  stats: DeveloperStats;
}

const StatsCards = ({ stats }: Props) => {
  const items = [
    { label: "Assigned", value: stats.assigned, color: "blue" },
    { label: "Pending", value: stats.pending, color: "orange" },
    { label: "In Progress", value: stats.inProgress, color: "purple" },
    { label: "Completed", value: stats.completed, color: "green" },
    { label: "Projects", value: stats.projects, color: "cyan" },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <DeveloperDashboardCard
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;