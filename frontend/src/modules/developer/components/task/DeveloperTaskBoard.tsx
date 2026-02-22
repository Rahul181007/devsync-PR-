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
import Spinner from "../../../../shared/components/LoadingSpinner";

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

    if (fromColumn === "IN_PROGRESS" && toColumn === "SUBMITTED") {
      setSubmitTaskId(taskId);
      return;
    }

    const allowedMoves: Record<string, string[]> = {
      BACKLOG: ["TODO"],
      TODO: ["IN_PROGRESS"],
    };

    const isAllowed = allowedMoves[fromColumn]?.includes(toColumn) ?? false;

    if (!isAllowed) {
      return;
    }

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
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
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

  // Calculate total tasks
  const totalTasks = Object.values(COLUMN_MAP).reduce((acc, tasks) => acc + tasks.length, 0);

  return (
    <>
      {/* Board Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Task Board</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Drag & drop to update status
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const config = COLUMN_CONFIG[col];
            const tasks = COLUMN_MAP[col];
            
            return (
              <DroppableColumn key={col} id={col} title={col}>
                {/* Column Header */}
                <div className={`mb-3 p-3 rounded-lg ${config.bgColor} border border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                      <h3 className={`text-sm font-semibold ${config.color}`}>
                        {col}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{config.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-white ${config.color}`}>
                        {tasks.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tasks Container */}
                <div className="space-y-2 min-h-[200px]">
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                      <p className="text-xs text-gray-400">No tasks</p>
                      <p className="text-xs text-gray-300 mt-1">Drop tasks here</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <DraggableTaskCard
                        key={task.id}
                        task={task}
                        column={col}
                        onClick={() => setSelectedTaskId(task.id)}
                      />
                    ))
                  )}
                </div>
              </DroppableColumn>
            );
          })}
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

      {/* Submit Task Modal */}
      {submitTaskId && (
        <SubmitTaskModal
          isOpen={true}
          onClose={() => setSubmitTaskId(null)}
          onSubmit={(data) => {
            dispatch(
              submitDeveloperTask({
                projectId,
                taskId: submitTaskId,
                data
              })
            );
            setSubmitTaskId(null);
          }}
        />
      )}
    </>
  );
};

export default DeveloperTaskBoard;


