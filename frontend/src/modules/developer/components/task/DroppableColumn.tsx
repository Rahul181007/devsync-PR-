import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// Column configuration for colors and styling
const COLUMN_CONFIG: Record<string, { color: string; bgColor: string; dotColor: string; icon: string }> = {
  BACKLOG: { 
    color: "text-gray-700", 
    bgColor: "bg-gray-50", 
    dotColor: "bg-gray-400",
    icon: "📦"
  },
  TODO: { 
    color: "text-blue-700", 
    bgColor: "bg-blue-50", 
    dotColor: "bg-blue-500",
    icon: "📝"
  },
  IN_PROGRESS: { 
    color: "text-yellow-700", 
    bgColor: "bg-yellow-50", 
    dotColor: "bg-yellow-500",
    icon: "⚙️"
  },
  SUBMITTED: { 
    color: "text-purple-700", 
    bgColor: "bg-purple-50", 
    dotColor: "bg-purple-500",
    icon: "✓"
  },
  COMPLETED: { 
    color: "text-green-700", 
    bgColor: "bg-green-50", 
    dotColor: "bg-green-500",
    icon: "✅"
  },
};

const DroppableColumn = ({
  id,
  title,
  children,
}: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const config = COLUMN_CONFIG[title] || {
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    dotColor: "bg-gray-400",
    icon: "📋"
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-xl transition-all duration-200 
        ${isOver 
          ? "bg-blue-50/50 ring-2 ring-blue-300 ring-inset shadow-inner" 
          : config.bgColor
        }
      `}
    >


      {/* Children Container */}
      <div className="p-3 min-h-[200px]">
        {children}
      </div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <div className="px-3 pb-3">
          <div className="text-xs text-blue-600 bg-blue-100 rounded-md py-1.5 text-center font-medium">
            Drop here
          </div>
        </div>
      )}
    </div>
  );
};

export default DroppableColumn;