import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { clearSelectedTask, getTaskDetail, updateTaskStatus } from "../../store/task.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string | null
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    "TODO": { 
      color: "bg-gray-100 text-gray-700 border-gray-200", 
      label: "To Do" 
    },
    "IN_PROGRESS": { 
      color: "bg-blue-50 text-blue-700 border-blue-200", 
      label: "In Progress" 
    },
    "SUBMITTED": { 
      color: "bg-purple-50 text-purple-700 border-purple-200", 
      label: "Submitted" 
    },
    "COMPLETED": { 
      color: "bg-green-50 text-green-700 border-green-200", 
      label: "Completed" 
    }
  };

  const config = statusConfig[status] || statusConfig.TODO;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig: Record<string, { color: string }> = {
    "HIGH": { color: "bg-red-50 text-red-700 border-red-200" },
    "MEDIUM": { color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    "LOW": { color: "bg-green-50 text-green-700 border-green-200" },
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
};

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
                            {!loading && selectedTask && (
                                <StatusBadge status={selectedTask.status} />
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors text-xl font-medium"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Spinner size="lg" />
                        <p className="mt-3 text-sm text-gray-500">Loading task details...</p>
                    </div>
                )}

                {/* Content */}
                {!loading && selectedTask && (
                    <div className="max-h-[70vh] overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Title Section */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-xs font-medium uppercase tracking-wider">Title</span>
                                </div>
                                <p className="text-lg font-medium text-gray-900 pl-6">{selectedTask.title}</p>
                            </div>

                            {/* Description Section */}
                            {selectedTask.description && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-xs font-medium uppercase tracking-wider">Description</span>
                                    </div>
                                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        {selectedTask.description || "No description provided"}
                                    </p>
                                </div>
                            )}

                            {/* Meta Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                {/* Priority */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                                    <PriorityBadge priority={selectedTask.priority} />
                                </div>

                                {/* Sprint */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Sprint</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedTask.sprint
                                            ? selectedTask.sprint.name
                                            : "Backlog"}
                                    </p>
                                </div>

                                {/* Assignee */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Assignee</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedTask.assignee
                                            ? selectedTask.assignee.name
                                            : "Unassigned"}
                                    </p>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedTask.dueDate
                                            ? new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                              })
                                            : "No due date"}
                                    </p>
                                </div>
                            </div>

                            {/* Developer Submission Section */}
                            {selectedTask.submission && (
                                <div className="space-y-4 border-t border-gray-200 pt-5">
                                    <h3 className="font-semibold text-gray-900">
                                        Developer Submission
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Summary</p>
                                            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                {selectedTask.submission.summary}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Work Done</p>
                                            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                {selectedTask.submission.workDone}
                                            </p>
                                        </div>

                                        {selectedTask.submission.blockers && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Blockers
                                                </p>
                                                <p className="text-sm text-gray-800 bg-red-50 rounded-lg p-3 border border-red-100">
                                                    {selectedTask.submission.blockers}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        {selectedTask.status === "SUBMITTED" && (
                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={handleMoveToInProgress}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
                                >
                                    Move to In Progress
                                </button>

                                <button
                                    onClick={handleMarkCompleted}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};