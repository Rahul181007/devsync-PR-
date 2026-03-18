import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { addTaskComment, clearSelectedTask, getTaskAttachments, getTaskComments, getTaskDetail, updateTaskStatus, uploadTaskAttachment } from "../../store/task.slice";
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
    ChatBubbleLeftIcon,
    PaperClipIcon,
} from "@heroicons/react/24/outline";
import {
    CheckCircleIcon,
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
        bgColor: string;
        label: string;
        icon: ComponentType<{ className?: string }>;
    }

    const statusConfig: Record<string, StatusConfig> = {
        "TODO": {
            color: "text-gray-700",
            bgColor: "bg-gray-100",
            label: "To Do",
            icon: ClockIcon
        },
        "IN_PROGRESS": {
            color: "text-blue-700",
            bgColor: "bg-blue-50",
            label: "In Progress",
            icon: ArrowPathIcon
        },
        "SUBMITTED": {
            color: "text-purple-700",
            bgColor: "bg-purple-50",
            label: "Submitted",
            icon: PaperAirplaneIcon
        },
        "COMPLETED": {
            color: "text-green-700",
            bgColor: "bg-green-50",
            label: "Completed",
            icon: CheckCircleIcon
        }
    };

    const config = statusConfig[status] || statusConfig.TODO;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
    interface PriorityConfig {
        color: string;
        bgColor: string;
        icon: ComponentType<{ className?: string }>;
    }

    const priorityConfig: Record<string, PriorityConfig> = {
        "HIGH": {
            color: "text-red-700",
            bgColor: "bg-red-50",
            icon: FlagSolidIcon
        },
        "MEDIUM": {
            color: "text-yellow-700",
            bgColor: "bg-yellow-50",
            icon: FlagIcon
        },
        "LOW": {
            color: "text-green-700",
            bgColor: "bg-green-50",
            icon: FlagIcon
        },
    };

    const config = priorityConfig[priority] || priorityConfig.MEDIUM;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {priority.charAt(0) + priority.slice(1).toLowerCase()}
        </span>
    );
};

// Type badge component
const TypeBadge = ({ type }: { type: string }) => {
    interface TypeConfig {
        color: string;
        bgColor: string;
        icon: ComponentType<{ className?: string }>;
    }

    const typeConfig: Record<string, TypeConfig> = {
        EPIC: {
            color: "text-purple-700",
            bgColor: "bg-purple-50",
            icon: SparklesIcon
        },
        STORY: {
            color: "text-blue-700",
            bgColor: "bg-blue-50",
            icon: DocumentTextIcon
        },
        TASK: {
            color: "text-gray-700",
            bgColor: "bg-gray-100",
            icon: TagIcon
        },
        BUG: {
            color: "text-red-700",
            bgColor: "bg-red-50",
            icon: ExclamationTriangleIcon
        }
    };

    const config = typeConfig[type] || typeConfig.TASK;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
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
    bgColor?: string;
}

const InfoItem = ({ icon: Icon, label, value, bgColor = "bg-gray-50" }: InfoItemProps) => (
    <div className="flex items-start gap-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
            <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
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
    const { selectedTask, loading, comments, commentsLoading,attachments,attachmentsLoading } = useAppSelector((state) => state.companyAdminTask);
    const [commentText, setCommentText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    useEffect(() => {
        if (isOpen && taskId) {
            dispatch(getTaskComments({ projectId, taskId }));
        }
    }, [dispatch, isOpen, projectId, taskId]);


    useEffect(() => {
  if (isOpen && taskId) {
    dispatch(getTaskAttachments({ projectId, taskId }));
  }
}, [dispatch, isOpen, projectId, taskId]);

    const handleAddComment = () => {
        if (!commentText.trim() || !taskId) return;

        dispatch(
            addTaskComment({
                projectId,
                taskId,
                message: commentText,
            })
        );

        setCommentText("");
    };

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

    const handleUpload = () => {
  if (!selectedFile || !taskId) return;

  dispatch(
    uploadTaskAttachment({
      projectId,
      taskId,
      file: selectedFile,
    })
  );

  setSelectedFile(null);
};

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                        <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
                        {!loading && selectedTask && (
                            <StatusBadge status={selectedTask.status} />
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-16 flex flex-col items-center justify-center">
                        <Spinner size="lg" />
                        <p className="mt-4 text-sm text-gray-500">Loading task details...</p>
                    </div>
                )}

                {/* Content */}
                {!loading && selectedTask && (
                    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <div className="bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title</p>
                                <p className="text-lg font-medium text-gray-900">{selectedTask.title}</p>
                            </div>

                            {/* Description */}
                            {selectedTask.description && (
                                <div className="bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {selectedTask.description}
                                    </p>
                                </div>
                            )}

                            {/* Type & Priority Row */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[140px]">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
                                    <TypeBadge type={selectedTask.type} />
                                </div>
                                <div className="flex-1 min-w-[140px]">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</p>
                                    <PriorityBadge priority={selectedTask.priority} />
                                </div>
                            </div>

                            {/* Meta Information Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                                <InfoItem
                                    icon={CalendarIcon}
                                    label="Sprint"
                                    value={selectedTask.sprint ? selectedTask.sprint.name : "Backlog"}
                                    bgColor="bg-white"
                                />
                                <InfoItem
                                    icon={UserIcon}
                                    label="Assignee"
                                    value={selectedTask.assignee ? selectedTask.assignee.name : "Unassigned"}
                                    bgColor="bg-white"
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
                                    bgColor="bg-white"
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
                                        bgColor="bg-white"
                                    />
                                )}
                            </div>

                            {/* Developer Submission */}
                            {selectedTask.submission && (
                                <div className="space-y-4 bg-linear-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-100 rounded-lg">
                                            <PaperAirplaneIcon className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Submission Details</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-4 border border-purple-50">
                                            <p className="text-xs font-medium text-purple-600 mb-1">Summary</p>
                                            <p className="text-sm text-gray-800">{selectedTask.submission.summary}</p>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-purple-50">
                                            <p className="text-xs font-medium text-purple-600 mb-1">Work Done</p>
                                            <p className="text-sm text-gray-800">{selectedTask.submission.workDone}</p>
                                        </div>

                                        {selectedTask.submission.blockers && (
                                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                                <p className="text-xs font-medium text-red-600 mb-1">Blockers</p>
                                                <p className="text-sm text-red-700">{selectedTask.submission.blockers}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Two Column Layout for Comments and Attachments */}
                        <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Comments Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-500" />
                                            Comments ({comments.length})
                                        </h3>
                                    </div>

                                    {/* Comment List */}
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                                        {commentsLoading ? (
                                            <div className="flex items-center justify-center py-6">
                                                <Spinner size="sm" />
                                                <p className="ml-2 text-xs text-gray-400">Loading comments...</p>
                                            </div>
                                        ) : comments.length === 0 ? (
                                            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                                                <ChatBubbleLeftIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">No comments yet</p>
                                                <p className="text-xs text-gray-300 mt-1">Be the first to comment</p>
                                            </div>
                                        ) : (
                                            comments.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-medium text-white">
                                                                {c.userName?.charAt(0).toUpperCase() || "U"}
                                                            </span>
                                                        </div>
                                                        <p className="font-medium text-gray-900 text-xs">
                                                            {c.userName}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 ml-auto">
                                                            {new Date(c.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 ml-8">{c.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Comment Input */}
                                    <div className="flex gap-2 items-center">
                                        <input
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            disabled={!commentText.trim()}
                                            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                !commentText.trim()
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95"
                                            }`}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>

                                {/* Attachments Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                            <PaperClipIcon className="w-4 h-4 text-gray-500" />
                                            Attachments ({attachments.length})
                                        </h3>
                                    </div>

                                    {/* Upload Area */}
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="file"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-medium
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100
                                                    cursor-pointer"
                                            />
                                            <button
                                                onClick={handleUpload}
                                                disabled={!selectedFile}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                                    !selectedFile
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95"
                                                }`}
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>

                                    {/* Attachments List */}
                                    <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
                                        {attachmentsLoading ? (
                                            <div className="flex items-center justify-center py-6 bg-white rounded-lg border border-gray-200">
                                                <Spinner size="sm" />
                                                <p className="ml-2 text-xs text-gray-400">Loading attachments...</p>
                                            </div>
                                        ) : attachments.length === 0 ? (
                                            <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                                                <PaperClipIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">No attachments</p>
                                                <p className="text-xs text-gray-300 mt-1">Upload files to share</p>
                                            </div>
                                        ) : (
                                            attachments.map((a) => (
                                                <a
                                                    key={a.id}
                                                    href={a.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                                                >
                                                    <span className="text-lg">📎</span>
                                                    <span className="flex-1 text-sm text-gray-700 group-hover:text-blue-600 truncate">
                                                        {a.fileName}
                                                    </span>
                                                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Download
                                                    </span>
                                                </a>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        {selectedTask.status === "SUBMITTED" && (
                            <div className="border-t border-gray-100 px-6 py-4 bg-linear-to-r from-gray-50 to-white flex justify-end gap-3">
                                <button
                                    onClick={handleMoveToInProgress}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-all active:scale-95"
                                >
                                    Move to In Progress
                                </button>
                                <button
                                    onClick={handleMarkCompleted}
                                    className="px-4 py-2 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow transition-all active:scale-95"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Mark Completed
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};