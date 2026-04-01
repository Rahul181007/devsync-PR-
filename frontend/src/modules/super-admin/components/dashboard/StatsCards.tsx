import type { DashboardStats } from "../../typess/dashboard.types";
import StatCard from "./StatCard";

interface StatsCardsProps {
    stats?: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    if (!stats) return null;

    const items = [
        { 
            title: "Total Companies", 
            value: stats.totalCompanies,
            icon: "🏢",
            color: "blue" as const
        },
        { 
            title: "Active Companies", 
            value: stats.activeCompanies,
            icon: "✅",
            color: "emerald" as const
        },
        { 
            title: "Pending", 
            value: stats.pendingCompanies,
            icon: "⏳",
            color: "amber" as const
        },
        { 
            title: "Revenue", 
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: "💰",
            color: "purple" as const
        }
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <StatCard 
                    key={i} 
                    title={item.title} 
                    value={item.value}
                    icon={item.icon}
                    color={item.color}
                />
            ))}
        </div>
    );
};

export default StatsCards