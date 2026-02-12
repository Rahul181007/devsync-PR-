import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const DroppableColumn = ({
  id,
  title,
  children,
}: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-3 transition ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <h3 className="text-sm font-semibold mb-3">
        {title.replace("_", " ")}
      </h3>
      {children}
    </div>
  );
};

export default DroppableColumn;
