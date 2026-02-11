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

const DraggableTaskCard = ({ task, column, onClick }: Props) => {
  // 🔒 Lock submitted & completed
  const isLocked =
    column === "SUBMITTED" || column === "COMPLETED";

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
      disabled: isLocked, // 🚀 disables dragging
      data: { column },
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isLocked ? listeners : {})}
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-3 text-sm
        ${
          isLocked
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        }
      `}
    >
      <p className="font-medium">{task.title}</p>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{task.priority}</span>
        <span>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "—"}
        </span>
      </div>
    </div>
  );
};

export default DraggableTaskCard;


