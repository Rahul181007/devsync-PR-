import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
    activateSprint,
    completeSprint,
    getProjectSprints,
    getSprintDetail
} from "../../store/sprint.slice";
import { CreateSprintModal } from "./CreateSprintModal";
import toast from "react-hot-toast";
import { PlanSprintModal } from "./PlanSprintModal";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface Props {
    projectId: string;
}

const STATUSES = [
    "BACKLOG",
    "TODO",
    "IN_PROGRESS",
    "SUBMITTED",
    "COMPLETED"
];

export const SprintBoard = ({ projectId }: Props) => {
    const dispatch = useAppDispatch();

    const { sprints, selectedSprint, sprintTasks, loading } =
        useAppSelector((state) => state.companyAdminSprint);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
    const [unfinishedCount, setUnfinishedCount] = useState(0);

    useEffect(() => {
        dispatch(getProjectSprints(projectId));
    }, [dispatch, projectId]);


    const totalTasks = sprintTasks.length;
    const completedTasks = sprintTasks.filter((task) => task.status === "COMPLETED").length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
    const handleSelectSprint = (sprintId: string) => {
        dispatch(getSprintDetail({ projectId, sprintId }));
    };

    const handleActivateSprint = async () => {
        if (!selectedSprint) return;
        const result = await dispatch(activateSprint({
            projectId,
            sprintId: selectedSprint.id
        }))

        if (activateSprint.fulfilled.match(result)) {
            toast.success("Sprint activated succeesfully")
        }

        if (activateSprint.rejected.match(result)) {
            toast.error(result.payload as string);
        }
    }

    const handleCompleteSprint = () => {
        if (!selectedSprint) return;

        const unfinishedTasks = sprintTasks.filter(
            (task) => task.status !== "COMPLETED"
        );

        if (unfinishedTasks.length > 0) {
            setUnfinishedCount(unfinishedTasks.length);
            setIsCompleteConfirmOpen(true);
            return;
        }

        executeCompleteSprint();
    };


    const executeCompleteSprint = async () => {
        if (!selectedSprint) return;

        const result = await dispatch(
            completeSprint({
                projectId,
                sprintId: selectedSprint.id
            })
        );

        if (completeSprint.fulfilled.match(result)) {
            toast.success("Sprint completed successfully");
        }

        if (completeSprint.rejected.match(result)) {
            toast.error(result.payload as string);
        }

        setIsCompleteConfirmOpen(false);
    };



    return (
        <div className="flex gap-6">
            {/* ================= Left Sprint List ================= */}
            <div className="w-64 bg-white rounded-xl shadow p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                        Sprints
                    </h3>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="text-sm px-2 py-1 bg-blue-600 text-white rounded"
                    >
                        + Sprint
                    </button>
                </div>

                {sprints.map((sprint) => (
                    <div
                        key={sprint.id}
                        onClick={() => handleSelectSprint(sprint.id)}
                        className={`p-3 rounded-lg cursor-pointer border ${selectedSprint?.id === sprint.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        <p className="text-sm font-medium">
                            {sprint.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {sprint.status}
                        </p>
                    </div>
                ))}
            </div>

            {/* ================= Right Sprint Board ================= */}
            <div className="flex-1">
                {!selectedSprint && (
                    <div className="p-6 text-gray-500">
                        Select a sprint to view details
                    </div>
                )}

                {selectedSprint && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedSprint.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedSprint.goal || "—"}
                                </p>
                                {/* Progress Section */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>
                                            {completedTasks} / {totalTasks} completed
                                        </span>
                                        <span>{progress}%</span>
                                    </div>

                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                            </div>

                            {selectedSprint.status === "PLANNED" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsPlanOpen(true)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                                    >
                                        Add Task
                                    </button>

                                    <button
                                        onClick={handleActivateSprint}
                                        className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                                    >
                                        Activate
                                    </button>
                                </div>
                            )}

                            {selectedSprint.status === "ACTIVE" && (
                                <div className="flex gap-2">
                                    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded">
                                        ACTIVE
                                    </span>

                                    <button
                                        onClick={handleCompleteSprint}
                                        className="px-3 py-2 bg-purple-600 text-white rounded text-sm"
                                    >
                                        Complete
                                    </button>
                                </div>
                            )}


                            {selectedSprint.status === "COMPLETED" && (
                                <span className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded">
                                    COMPLETED
                                </span>
                            )}
                        </div>

{/* Task Board */}
<div className="grid grid-cols-5 gap-4">
  {STATUSES.map((status) => {
    const tasksByStatus = sprintTasks.filter(
      (task) => task.status === status
    );

    return (
      <div
        key={status}
        className="bg-gray-100 rounded-lg p-3 h-[500px] flex flex-col"
      >
        {/* Column Header with Count */}
        <h4 className="text-sm font-semibold mb-3 flex justify-between items-center">
          <span>{status}</span>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {tasksByStatus.length}
          </span>
        </h4>

        {/* Scrollable Task Container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {tasksByStatus.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-6">
              No tasks
            </p>
          )}

          {tasksByStatus.map((task) => (
            <div
              key={task.id}
              className="bg-white p-3 rounded-lg shadow text-sm space-y-2 border hover:shadow-md transition"
            >
              {/* Title */}
              <p className="font-medium text-gray-800">
                {task.title}
              </p>

              {/* Task Code */}
              {task.code && (
                <p className="text-xs text-gray-400">
                  {task.code}
                </p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-xs">
                {/* Priority Badge */}
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    task.priority === "HIGH"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority}
                </span>

                {/* Assignee */}
                {task.assignee && (
                  <span className="text-gray-500 truncate max-w-[100px]">
                    👤 {task.assignee.name}
                  </span>
                )}
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <p className="text-xs text-gray-400">
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  })}
</div>

                    </div>
                )}

                {loading && (
                    <div className="p-6 flex justify-center">
                        <Spinner size="lg" />
                    </div>
                )}
            </div>

            {/* ================= Create Sprint Modal ================= */}
            <CreateSprintModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                projectId={projectId}
            />

            <PlanSprintModal
                isOpen={isPlanOpen}
                onClose={() => setIsPlanOpen(false)}
                projectId={projectId}
                sprintId={selectedSprint?.id ?? ""}
            />

            {isCompleteConfirmOpen && selectedSprint && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[450px] rounded-xl p-6 space-y-4 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-600">
                            ⚠ Unfinished Tasks
                        </h3>

                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-red-600">
                                {unfinishedCount}
                            </span>{" "}
                            task{unfinishedCount > 1 ? "s are" : " is"} still incomplete.
                        </p>

                        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>Incomplete tasks will move back to backlog</li>
                            <li>Sprint will be permanently marked as completed</li>
                        </ul>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsCompleteConfirmOpen(false)}
                                className="px-4 py-2 border rounded-lg text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={executeCompleteSprint}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                            >
                                Complete Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
