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
  const isLocked =
    column === "SUBMITTED" || column === "COMPLETED";

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
      disabled: isLocked,
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
      className={`bg-white rounded-lg shadow p-3 text-sm ${
        isLocked
          ? "opacity-70 cursor-not-allowed"
          : "cursor-default"
      }`}
    >

      {!isLocked && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-xs text-gray-400 mb-1"
        >
          ⠿ Drag
        </div>
      )}

     
      <div
        onClick={onClick}
        className="cursor-pointer hover:bg-gray-50 rounded p-1"
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
    </div>
  );
};

export default DraggableTaskCard;



