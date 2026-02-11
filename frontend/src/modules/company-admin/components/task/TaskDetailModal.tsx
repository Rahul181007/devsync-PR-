import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { clearSelectedTask, getTaskDetail, updateTaskStatus } from "../../store/task.slice";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string | null
}

export const TaskDetailModal = ({
    isOpen,
    onClose,
    projectId,
    taskId
}: TaskDetailModalProps) => {
    const dispatch = useAppDispatch();
    const { selectedTask, loading } = useAppSelector((state) => state.companyAdminTask);

useEffect(() => {
  if (isOpen && taskId) {
    dispatch(getTaskDetail({ projectId, taskId }))
  }
}, [dispatch, isOpen, projectId, taskId])

useEffect(() => {
  if (!isOpen) {
    dispatch(clearSelectedTask())
  }
}, [dispatch, isOpen])

    const handleMarkCompleted = () => {
        if (!taskId) return;
        dispatch(updateTaskStatus({ projectId, taskId, status: "COMPLETED" }))

        onClose();
    }

    const handleMoveToInProgress = () => {
        if (!taskId) return;
        dispatch(updateTaskStatus({ projectId, taskId, status: 'IN_PROGRESS' }))
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Task Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-sm text-gray-500">Loading task...</p>
                )}

                {!loading && selectedTask && (
                    <>
                        {/* Title */}
                        <div>
                            <p className="text-xs text-gray-500">Title</p>
                            <p className="font-medium">{selectedTask.title}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-xs text-gray-500">Description</p>
                            <p className="text-sm text-gray-700">
                                {selectedTask.description}
                            </p>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">{selectedTask.status}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Priority</p>
                                <p className="font-medium">{selectedTask.priority}</p>
                            </div>
                             {/* Sprint */}
<div>
  <p className="text-gray-500">Sprint</p>
  <p className="font-medium">
    {selectedTask.sprint
      ? selectedTask.sprint.name
      : "Backlog"}
  </p>
</div>

                            <div>
                                <p className="text-gray-500">Assignee</p>
                                <p className="font-medium">
                                    {selectedTask.assignee
                                        ? selectedTask.assignee.name
                                        : "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Due Date</p>
                                <p className="font-medium">
                                    {selectedTask.dueDate
                                        ? new Date(selectedTask.dueDate).toLocaleDateString()
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {/* Submission (only if SUBMITTED) */}
                        {selectedTask.submission && (
                            <div className="border-t pt-4 space-y-2">
                                <h3 className="font-semibold text-sm">
                                    Developer Submission
                                </h3>

                                <div>
                                    <p className="text-xs text-gray-500">Summary</p>
                                    <p className="text-sm">
                                        {selectedTask.submission.summary}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Work Done</p>
                                    <p className="text-sm">
                                        {selectedTask.submission.workDone}
                                    </p>
                                </div>

                                {selectedTask.submission.blockers && (
                                    <div>
                                        <p className="text-xs text-gray-500">Blockers</p>
                                        <p className="text-sm">
                                            {selectedTask.submission.blockers}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {selectedTask.status === "SUBMITTED" && (
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={handleMoveToInProgress}
                                    className="px-3 py-2 border rounded text-sm"
                                >
                                    Move to In Progress
                                </button>

                                <button
                                    onClick={handleMarkCompleted}
                                    className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
};
