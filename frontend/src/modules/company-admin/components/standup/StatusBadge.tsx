interface StatusBadgeProps {
  status: "SUBMITTED" | "PARTIAL" | "MISSED";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styleMap = {
    SUBMITTED: "bg-green-100 text-green-700 border-green-200",
    PARTIAL: "bg-yellow-100 text-yellow-700 border-yellow-200",
    MISSED: "bg-red-100 text-red-700 border-red-200",
  };

  const iconMap = {
    SUBMITTED: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    PARTIAL: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    MISSED: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  const labelMap = {
    SUBMITTED: "Submitted",
    PARTIAL: "Partial",
    MISSED: "Missed",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 
        text-xs font-medium rounded-full border
        ${styleMap[status]}
      `}
    >
      {iconMap[status]}
      {labelMap[status]}
    </span>
  );
};