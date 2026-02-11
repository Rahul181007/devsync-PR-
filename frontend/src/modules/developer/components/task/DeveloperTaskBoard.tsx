import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  getDeveloperTasks,
  getDeveloperTaskDetails,
  clearSelectedTask,
  updateDeveloperTaskStatus,
  submitDeveloperTask,
} from "../../store/task.slice";
import DeveloperTaskDetailModal from "../../components/task/DeveloperTaskDetailModal";
import DraggableTaskCard from "../../components/task/DraggableTaskCard";
import DroppableColumn from "../../components/task/DroppableColumn";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import SubmitTaskModal from "./SubmitTaskModal";

interface DeveloperTaskBoardProps {
  projectId: string;
}

const COLUMNS = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "SUBMITTED",
  "COMPLETED",
] as const;

const DeveloperTaskBoard = ({ projectId }: DeveloperTaskBoardProps) => {
  const dispatch = useAppDispatch();

  const { board, loading, error, selectedTask } = useAppSelector(
    (state) => state.developerTask
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over) return;

  const fromColumn = active.data.current?.column as string | undefined;
  const toColumn = over.id as string;
  const taskId = active.id as string;

  if (!fromColumn || fromColumn === toColumn) return;

  // 🚦 RULES
  if (fromColumn === "IN_PROGRESS" && toColumn === "SUBMITTED") {
    // 👉 OPEN SUBMIT MODAL (NO STATUS UPDATE YET)
    setSubmitTaskId(taskId);
    return;
  }

  const allowedMoves: Record<string, string[]> = {
    BACKLOG: ["TODO"],
    TODO: ["IN_PROGRESS"],
  };

  const isAllowed =
    allowedMoves[fromColumn]?.includes(toColumn) ?? false;

  if (!isAllowed) {
    console.warn(`❌ Blocked move: ${fromColumn} → ${toColumn}`);
    return;
  }

  // ✅ NORMAL STATUS UPDATE
  dispatch(
    updateDeveloperTaskStatus({
      projectId,
      taskId,
      status: toColumn as "TODO" | "IN_PROGRESS",
    })
  );
};




  useEffect(() => {
    dispatch(getDeveloperTasks(projectId));
  }, [dispatch, projectId]);

  // fetch task detail when card is clicked
  useEffect(() => {
    if (selectedTaskId) {
      dispatch(
        getDeveloperTaskDetails({
          projectId,
          taskId: selectedTaskId,
        })
      );
    }
  }, [dispatch, projectId, selectedTaskId]);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Loading tasks…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!board) return null;

  const COLUMN_MAP = {
    BACKLOG: board.backlog,
    TODO: board.todo,
    IN_PROGRESS: board.inProgress,
    SUBMITTED: board.submitted,
    COMPLETED: board.completed,
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {COLUMNS.map((col) => (
            <DroppableColumn key={col} id={col} title={col}>
              {COLUMN_MAP[col].length === 0 ? (
                <div className="text-xs text-gray-400">No tasks</div>
              ) : (
                <div className="space-y-2">
                  {COLUMN_MAP[col].map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      column={col}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              )}
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      {/* Task Detail Modal */}
      {selectedTask && (
        <DeveloperTaskDetailModal
          task={selectedTask}
          onClose={() => {
            setSelectedTaskId(null);
            dispatch(clearSelectedTask());
          }}
        />
      )}

      {submitTaskId && (
  <SubmitTaskModal
    isOpen={true}
    onClose={() => setSubmitTaskId(null)}
    onSubmit={(data) => {
      dispatch(
        submitDeveloperTask({
            projectId,
            taskId:submitTaskId,
            data
        })
      );
      setSubmitTaskId(null)
    }}
  />
)}

    </>
  );
};

export default DeveloperTaskBoard;



