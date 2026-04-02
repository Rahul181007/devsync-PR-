interface Props {
  title: string;
  value: number;
}

const DashboardCard = ({ title, value }: Props) => {
  // Get color based on card type
  const getCardColor = () => {
    if (title === "Total Projects") return "blue";
    if (title === "Active Projects") return "cyan";
    if (title === "Total Developers") return "purple";
    if (title === "Active Developers") return "violet";
    if (title === "Total Tasks") return "orange";
    if (title === "Completed Tasks") return "green";
    if (title === "Overdue Tasks") return "red";
    if (title === "Blocked Developers") return "rose";
    return "gray";
  };

  const color = getCardColor();
  
  const colorStyles = {
    blue: "border-t-blue-500 bg-blue-50/30",
    cyan: "border-t-cyan-500 bg-cyan-50/30",
    purple: "border-t-purple-500 bg-purple-50/30",
    violet: "border-t-violet-500 bg-violet-50/30",
    orange: "border-t-orange-500 bg-orange-50/30",
    green: "border-t-green-500 bg-green-50/30",
    red: "border-t-red-500 bg-red-50/30",
    rose: "border-t-rose-500 bg-rose-50/30",
    gray: "border-t-gray-500 bg-gray-50/30",
  };

  return (
    <div className={`rounded-lg border border-gray-100 border-t-4 ${colorStyles[color]} shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-500 mb-2">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">units</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;