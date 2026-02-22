interface SummaryCardProps {
  title: string;
  value: number;
  color?: "green" | "yellow" | "red";
}

export const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  const colorMap = {
    green: "text-green-600 bg-green-50 border-green-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
    red: "text-red-600 bg-red-50 border-red-200",
  };

  const defaultStyle = "text-gray-900 bg-white border-gray-200";

  return (
    <div className={`
      rounded-lg p-3 text-center border-2 transition-all
      ${color ? colorMap[color] : defaultStyle}
    `}>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
        {title}
      </p>
      <p className={`text-2xl font-bold ${color ? `text-${color}-600` : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
};