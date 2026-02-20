interface SummaryCardProps {
  title: string;
  value: number;
  color?: "green" | "yellow" | "red";
}

export const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="border rounded-lg p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${color ? colorMap[color] : ""}`}>
        {value}
      </p>
    </div>
  );
};