import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { DeveloperTaskDetail } from "../../types/task.type";
import { addDeveloperTaskComment, getDevelopersTaskAttachments, getDeveloperTaskComments, uploadTaskAttachment } from "../../store/task.slice";

interface Props {
  task: DeveloperTaskDetail;
  projectId: string;
  onClose: () => void;
}

const DeveloperTaskDetailModal = ({ task, projectId, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { comments, commentsLoading,attachments,attachmentsLoading } = useAppSelector(
    (state) => state.developerTask
  );

  const [commentText, setCommentText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  useEffect(() => {
    if (task?.id) {
      dispatch(
        getDeveloperTaskComments({
          projectId,
          taskId: task.id,
        })
      );
    }
  }, [dispatch, task, projectId]);

  useEffect(() => {
  if (task?.id) {
    dispatch(
      getDevelopersTaskAttachments({
        projectId,
        taskId: task.id,
      })
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
    })
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
      })
    );

    setCommentText("");
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-base font-semibold text-gray-900">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <div className="p-5 space-y-4">
            {/* Title */}
            <div className="bg-linear-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">TITLE</p>
              <p className="text-sm font-medium text-gray-900">{task.title}</p>
            </div>

            {/* Description */}
            <div className="bg-linear-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">DESCRIPTION</p>
              <p className="text-sm text-gray-700">{task.description || "—"}</p>
            </div>

            {/* Type, Status, Priority Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">TYPE</p>
                <p className="text-sm font-medium text-gray-900">{task.type}</p>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">STATUS</p>
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">PRIORITY</p>
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-linear-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">DUE DATE</p>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

          {/* Two Column Layout for Comments and Attachments */}
          <div className="border-t border-gray-100 bg-gray-50/50 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Comments Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments ({comments.length})
                </h3>

                {/* Comment List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                  {commentsLoading ? (
                    <div className="flex items-center justify-center py-4 bg-white rounded-lg border border-gray-100">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <p className="ml-2 text-xs text-gray-400">Loading comments...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-200">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-xs text-gray-400">No comments yet</p>
                      <p className="text-xs text-gray-300 mt-1">Be the first to comment</p>
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-medium text-white">
                              {c.userName?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-700">{c.userName}</p>
                        </div>
                        <p className="text-xs text-gray-600 ml-6">{c.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2 items-center">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    placeholder="Write a comment..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className={`p-2 rounded-lg transition-all ${
                      !commentText.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.656l-7.07 7.07" />
                  </svg>
                  Attachments ({attachments.length})
                </h3>

                {/* Upload Area */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block w-full text-xs text-gray-500
                        file:mr-3 file:py-1 file:px-3
                        file:rounded-lg file:border-0
                        file:text-xs file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer"
                    />
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
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
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                  {attachmentsLoading ? (
                    <div className="flex items-center justify-center py-4 bg-white rounded-lg border border-gray-100">
                      <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
                      <p className="ml-2 text-xs text-gray-400">Loading attachments...</p>
                    </div>
                  ) : attachments.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-200">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.656l-7.07 7.07" />
                      </svg>
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
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <span className="text-base">📎</span>
                        <span className="flex-1 text-xs text-gray-700 group-hover:text-blue-600 truncate">
                          {a.fileName}
                        </span>
                        <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Download
                        </span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTaskDetailModal;