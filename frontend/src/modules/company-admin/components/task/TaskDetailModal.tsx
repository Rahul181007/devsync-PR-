import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { clearSelectedTask, getTaskDetail, updateTaskStatus } from "../../store/task.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";
import {
    XMarkIcon,
    TagIcon,
    CalendarIcon,
    UserIcon,
    FlagIcon,
    DocumentTextIcon,
    SparklesIcon,
    ArrowPathIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PaperAirplaneIcon,

} from "@heroicons/react/24/outline";
import {
    CheckCircleIcon ,
    FlagIcon as FlagSolidIcon
} from "@heroicons/react/24/solid";
import type { ComponentType } from 'react';

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string | null
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    interface StatusConfig {
        color: string;
        label: string;
        icon: ComponentType<{ className?: string }>;
    }

    const statusConfig: Record<string, StatusConfig> = {
        "TODO": {
            color: "bg-gray-100 text-gray-700 border-gray-200",
            label: "To Do",
            icon: ClockIcon
        },
        "IN_PROGRESS": {
            color: "bg-blue-50 text-blue-700 border-blue-200",
            label: "In Progress",
            icon: ArrowPathIcon
        },
        "SUBMITTED": {
            color: "bg-purple-50 text-purple-700 border-purple-200",
            label: "Submitted",
            icon: PaperAirplaneIcon
        },
        "COMPLETED": {
            color: "bg-green-50 text-green-700 border-green-200",
            label: "Completed",
            icon: CheckCircleIcon
        }
    };

    const config = statusConfig[status] || statusConfig.TODO;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
    interface PriorityConfig {
        color: string;
        icon: ComponentType<{ className?: string }>;
    }

    const priorityConfig: Record<string, PriorityConfig> = {
        "HIGH": { 
            color: "bg-red-50 text-red-700 border-red-200", 
            icon: FlagSolidIcon 
        },
        "MEDIUM": { 
            color: "bg-yellow-50 text-yellow-700 border-yellow-200", 
            icon: FlagIcon 
        },
        "LOW": { 
            color: "bg-green-50 text-green-700 border-green-200", 
            icon: FlagIcon 
        },
    };

    const config = priorityConfig[priority] || priorityConfig.MEDIUM;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {priority.charAt(0) + priority.slice(1).toLowerCase()}
        </span>
    );
};

// Type badge component
const TypeBadge = ({ type }: { type: string }) => {
    interface TypeConfig {
        color: string;
        icon: ComponentType<{ className?: string }>;
    }

    const typeConfig: Record<string, TypeConfig> = {
        EPIC: { 
            color: "bg-purple-50 text-purple-700 border-purple-200", 
            icon: SparklesIcon 
        },
        STORY: { 
            color: "bg-blue-50 text-blue-700 border-blue-200", 
            icon: DocumentTextIcon 
        },
        TASK: { 
            color: "bg-gray-50 text-gray-700 border-gray-200", 
            icon: TagIcon 
        },
        BUG: { 
            color: "bg-red-50 text-red-700 border-red-200", 
            icon: ExclamationTriangleIcon 
        }
    };

    const config = typeConfig[type] || typeConfig.TASK;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {type}
        </span>
    );
};

// Compact info item component
interface InfoItemProps {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
    <div className="flex items-start gap-2">
        <div className="p-1.5 bg-gray-50 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    </div>
);

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
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
                        {!loading && selectedTask && (
                            <StatusBadge status={selectedTask.status} />
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <Spinner size="lg" />
                        <p className="mt-3 text-sm text-gray-500">Loading task details...</p>
                    </div>
                )}

                {/* Content */}
                {!loading && selectedTask && (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <div className="p-5 space-y-4">
                            {/* Title */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Title</p>
                                <p className="text-base font-medium text-gray-900">{selectedTask.title}</p>
                            </div>

                            {/* Description */}
                            {selectedTask.description && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Description</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                        {selectedTask.description}
                                    </p>
                                </div>
                            )}

                            {/* Type & Priority Row */}
                            <div className="flex gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Type</p>
                                    <TypeBadge type={selectedTask.type} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                                    <PriorityBadge priority={selectedTask.priority} />
                                </div>
                            </div>

                            {/* Meta Information Grid */}
                            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
                                <InfoItem 
                                    icon={CalendarIcon}
                                    label="Sprint"
                                    value={selectedTask.sprint ? selectedTask.sprint.name : "Backlog"}
                                />
                                <InfoItem 
                                    icon={UserIcon}
                                    label="Assignee"
                                    value={selectedTask.assignee ? selectedTask.assignee.name : "Unassigned"}
                                />
                                <InfoItem 
                                    icon={ClockIcon}
                                    label="Due Date"
                                    value={selectedTask.dueDate
                                        ? new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })
                                        : "—"}
                                />
                                {selectedTask.createdAt && (
                                    <InfoItem 
                                        icon={CalendarIcon}
                                        label="Created"
                                        value={new Date(selectedTask.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    />
                                )}
                            </div>

                            {/* Developer Submission */}
                            {selectedTask.submission && (
                                <div className="space-y-3 border-t border-gray-200 pt-3">
                                    <div className="flex items-center gap-2">
                                        <PaperAirplaneIcon className="w-4 h-4 text-purple-600" />
                                        <h3 className="font-medium text-gray-900">Submission</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Summary</p>
                                            <p className="text-sm text-gray-800">{selectedTask.submission.summary}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Work Done</p>
                                            <p className="text-sm text-gray-800">{selectedTask.submission.workDone}</p>
                                        </div>

                                        {selectedTask.submission.blockers && (
                                            <div className="bg-red-50 rounded-lg p-3">
                                                <p className="text-xs text-red-500 mb-1">Blockers</p>
                                                <p className="text-sm text-red-700">{selectedTask.submission.blockers}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        {selectedTask.status === "SUBMITTED" && (
                            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 flex justify-end gap-2">
                                <button
                                    onClick={handleMoveToInProgress}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-white transition-colors"
                                >
                                    Move to In Progress
                                </button>
                                <button
                                    onClick={handleMarkCompleted}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                                >
                                    Mark Completed
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};