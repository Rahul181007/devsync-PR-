import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { DeveloperTaskDetail } from "../../types/task.type";
import {
  addDeveloperTaskComment,
  getDevelopersTaskAttachments,
  getDeveloperTaskComments,
  uploadTaskAttachment,
} from "../../store/task.slice";
import { deleteWorklog, getWorklogsByTask } from "../../store/worklog.slice";
import { CreateWorklogModal } from "./CreateWorklogModal";
import type { WorklogItem } from "../../types/worklog.types";
import { EditWorklogModal } from "./EditWorklogModal";

interface Props {
  task: DeveloperTaskDetail;
  projectId: string;
  onClose: () => void;
}

type TabType = "comments" | "attachments" | "worklogs";

const DeveloperTaskDetailModal = ({ task, projectId, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { comments, commentsLoading, attachments, attachmentsLoading } =
    useAppSelector((state) => state.developerTask);

  const { worklogs, loading } = useAppSelector((state) => state.devWorklog);
  const [commentText, setCommentText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isWorklogOpen, setIsWorklogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("comments");

  const [editingLog, setEditingLog] = useState<WorklogItem | null>(null);
  useEffect(() => {
    if (task?.id) {
      dispatch(
        getDeveloperTaskComments({
          projectId,
          taskId: task.id,
        }),
      );
    }
  }, [dispatch, task, projectId]);

  useEffect(() => {
    if (task?.id) {
      dispatch(
        getDevelopersTaskAttachments({
          projectId,
          taskId: task.id,
        }),
      );
    }
  }, [dispatch, task, projectId]);

  useEffect(() => {
    if (task?.id) {
      dispatch(
        getWorklogsByTask({
          projectId,
          taskId: task.id,
        }),
      );
    }
  }, [dispatch, task, projectId]);

  const handleUpload = () => {
    if (!selectedFile) return;

    dispatch(
      uploadTaskAttachment({
        projectId,
        taskId: task.id,
        file: selectedFile,
      }),
    );

    setSelectedFile(null);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    dispatch(
      addDeveloperTaskComment({
        projectId,
        taskId: task.id,
        message: commentText,
      }),
    );

    setCommentText("");
  };

  const handleEdit = (log: WorklogItem) => {
    setEditingLog(log);
  };

  const handleDelete = (worklogId: string) => {
    if (!confirm("Delete this worklog?")) return;

    dispatch(
      deleteWorklog({
        projectId,
        taskId: task.id,
        worklogId,
      }),
    );
  };
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      DONE: "bg-green-100 text-green-800",
      REVIEW: "bg-purple-100 text-purple-800",
      SUBMITTED: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: "bg-red-100 text-red-800",
      MEDIUM: "bg-orange-100 text-orange-800",
      LOW: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const tabs = [
    {
      id: "comments" as TabType,
      label: "Comments",
      count: comments.length,
      icon: "💬",
    },
    {
      id: "attachments" as TabType,
      label: "Attachments",
      count: attachments.length,
      icon: "📎",
    },
    {
      id: "worklogs" as TabType,
      label: "Worklogs",
      count: worklogs.length,
      icon: "⏱️",
    },
  ];

  const isSameDay = (date: string) => {
    const logDate = new Date(date);
    const today = new Date();

    return (
      logDate.getFullYear() === today.getFullYear() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getDate() === today.getDate()
    );
  };
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
        <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl transform transition-all max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {task.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Task ID: {task.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {task.status === "COMPLETED" ? (
                <span className="text-sm text-gray-400 px-2">
                  Worklog disabled
                </span>
              ) : (
                <button
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setIsWorklogOpen(true)}
                >
                  + Log Work
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Task Details Section */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </label>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {task.description || "—"}
                    </p>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Due Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-700">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Status and Priority */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Priority
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </label>
                    <p className="text-sm text-gray-700 mt-1 capitalize">
                      {task.type.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <div className="flex gap-1 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative
                      ${activeTab === tab.id
                        ? "text-blue-600 bg-white border-t border-x border-gray-200 rounded-t-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-t-lg"
                      }
                    `}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span
                      className={`
                      px-1.5 py-0.5 text-xs rounded-full
                      ${activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                        }
                    `}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white">
              {/* Comments Tab */}
              {activeTab === "comments" && (
                <div className="space-y-4">
                  {/* Comment Input */}
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0"></div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="Write a comment..."
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!commentText.trim()
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                            }`}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {commentsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-sm text-gray-500">No comments yet</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Be the first to start the conversation
                        </p>
                      </div>
                    ) : (
                      comments.map((c) => (
                        <div
                          key={c.id}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="shrink-0">
                            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {c.userName?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {c.userName}
                              </p>
                              <span className="text-xs text-gray-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {c.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Attachments Tab */}
              {activeTab === "attachments" && (
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                        className="flex-1 text-sm text-gray-500
                          file:mr-3 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer"
                      />
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedFile
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                          }`}
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* Attachments List */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {attachmentsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : attachments.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="text-4xl mb-2">📎</div>
                        <p className="text-sm text-gray-500">No attachments</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Upload files to share with your team
                        </p>
                      </div>
                    ) : (
                      attachments.map((a) => (
                        <a
                          key={a.id}
                          href={a.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all group border border-transparent"
                        >
                          <div className="text-2xl">📄</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                              {a.fileName}
                            </p>
                          </div>
                          <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Worklogs Tab */}
              {activeTab === "worklogs" && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : worklogs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-4xl mb-2">⏱️</div>
                      <p className="text-sm text-gray-500">No worklogs yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Log Work" to track your time
                      </p>
                    </div>
                  ) : (
                    worklogs.map((log) => {
                      const isEditable = isSameDay(log.date);

                      return (
                        <div
                          key={log.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">⏱️</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {log.timeSpent / 60}h
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                                {new Date(log.date).toLocaleDateString()}
                              </span>

                              {/* ✏️ Edit */}
                              <button
                                disabled={!isEditable}
                                onClick={() => handleEdit(log)}
                                className={`text-xs ${isEditable
                                    ? "text-blue-600 hover:underline"
                                    : "text-gray-400 cursor-not-allowed"
                                  }`}
                              >
                                Edit
                              </button>

                              {/* 🗑️ Delete */}
                              <button
                                disabled={!isEditable}
                                onClick={() => handleDelete(log.id)}
                                className={`text-xs ${isEditable
                                    ? "text-red-600 hover:underline"
                                    : "text-gray-400 cursor-not-allowed"
                                  }`}
                              >
                                Delete
                              </button>

                              {/* 🔒 Optional label */}
                              {!isEditable && (
                                <span className="text-[10px] text-gray-400">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>

                          {log.description && (
                            <p className="text-sm text-gray-600 mt-2 pl-7">
                              {log.description}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateWorklogModal
        isOpen={isWorklogOpen}
        onClose={() => setIsWorklogOpen(false)}
        projectId={projectId}
        taskId={task.id}
        estimatedTime={task.estimatedTime}
      />

      {editingLog && (
        <EditWorklogModal
          isOpen={!!editingLog}
          onClose={() => setEditingLog(null)}
          projectId={projectId}
          taskId={task.id}
          worklog={editingLog}
          estimatedTime={task.estimatedTime}
        />
      )}
    </>
  );
};

export default DeveloperTaskDetailModal;
