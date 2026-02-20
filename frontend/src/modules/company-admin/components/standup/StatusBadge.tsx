interface StatusBadgeProps {
  status: "SUBMITTED" | "PARTIAL" | "MISSED";
}

 export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styleMap = {
    SUBMITTED: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-700",
    MISSED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${styleMap[status]}`}
    >
      {status}
    </span>
  );
};