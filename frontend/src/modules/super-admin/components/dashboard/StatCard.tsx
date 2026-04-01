interface StatCardProps {
    title: string;
    value: string | number;
    icon?: string;
    color?: "blue" | "emerald" | "amber" | "purple";
}

const StatCard = ({ title, value, icon, color = "blue" }: StatCardProps) => {
    const colorClasses = {
        blue: {
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
            border: "hover:border-blue-200"
        },
        emerald: {
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
            iconText: "text-emerald-600",
            border: "hover:border-emerald-200"
        },
        amber: {
            bg: "bg-amber-50",
            iconBg: "bg-amber-100",
            iconText: "text-amber-600",
            border: "hover:border-amber-200"
        },
        purple: {
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            iconText: "text-purple-600",
            border: "hover:border-purple-200"
        }
    };

    const classes = colorClasses[color];

    return (
        <div className={`${classes.bg} rounded-xl border border-gray-100 ${classes.border} transition-all duration-300 hover:shadow-md`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {title}
                    </p>
                    {icon && (
                        <div className={`${classes.iconBg} w-8 h-8 rounded-lg flex items-center justify-center`}>
                            <span className={`${classes.iconText} text-base`}>{icon}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-baseline justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h2>
                    <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-[10px] text-gray-400">live</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard