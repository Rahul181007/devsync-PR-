import { useDraggable } from "@dnd-kit/core";

interface Props {
  task: {
    id: string;
    title: string;
    priority: string;
    dueDate?: string | null;
  };
  column: string;
  onClick: () => void;
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig: Record<string, { color: string; bgColor: string; label: string }> = {
    HIGH: { color: "text-red-700", bgColor: "bg-red-50", label: "High" },
    MEDIUM: { color: "text-yellow-700", bgColor: "bg-yellow-50", label: "Medium" },
    LOW: { color: "text-green-700", bgColor: "bg-green-50", label: "Low" },
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
      {config.label}
    </span>
  );
};

const DraggableTaskCard = ({ task, column, onClick }: Props) => {
  const isLocked = column === "SUBMITTED" || column === "COMPLETED";

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isLocked,
    data: { column },
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 100,
      }
    : undefined;

  // Column color mapping for left border
  const columnColorMap: Record<string, string> = {
    BACKLOG: "border-l-gray-400",
    TODO: "border-l-blue-400",
    IN_PROGRESS: "border-l-yellow-400",
    SUBMITTED: "border-l-purple-400",
    COMPLETED: "border-l-green-400",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-lg shadow-sm border-2 transition-all
        ${isLocked 
          ? "opacity-70 border-gray-200" 
          : "hover:shadow-md cursor-default border-gray-200"
        }
        ${isDragging ? "opacity-50 ring-2 ring-blue-500 ring-offset-2 shadow-xl" : ""}
        ${columnColorMap[column] || "border-l-gray-400"} border-l-4
      `}
    >
      {/* Drag Handle - only show if not locked */}
      {!isLocked && (
        <div
          {...attributes}
          {...listeners}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border-b border-gray-100 rounded-t-lg cursor-grab active:cursor-grabbing select-none"
        >
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
            Drag to move
          </span>
        </div>
      )}

      {/* Task Content */}
      <div
        onClick={onClick}
        className="cursor-pointer p-3 hover:bg-gray-50 transition-colors rounded-b-lg"
      >
        {/* Title */}
        <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
          {task.title}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <PriorityBadge priority={task.priority} />
          
          {/* Due Date */}
          {task.dueDate ? (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300">No due date</span>
          )}
        </div>

        {/* Column indicator for locked tasks */}
        {isLocked && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {column === "SUBMITTED" ? "Awaiting review" : "Completed"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableTaskCard;



