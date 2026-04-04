interface Props {
  label: string;
  value: number;
  color:
    | "blue"
    | "orange"
    | "purple"
    | "green"
    | "cyan";
}

const DeveloperDashboardCard = ({ label, value, color }: Props) => {
  const colorStyles = {
    blue: "border-t-blue-500 bg-blue-50/30",
    orange: "border-t-orange-500 bg-orange-50/30",
    purple: "border-t-purple-500 bg-purple-50/30",
    green: "border-t-green-500 bg-green-50/30",
    cyan: "border-t-cyan-500 bg-cyan-50/30",
  };

  return (
    <div
      className={`rounded-lg border border-gray-100 border-t-4 ${colorStyles[color]} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="p-4">
        <p className="text-xs font-medium text-gray-500 mb-2">
          {label}
        </p>

        <span className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default DeveloperDashboardCard;