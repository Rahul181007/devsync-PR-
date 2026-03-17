import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { DeveloperTaskDetail } from "../../types/task.type";
import { addDeveloperTaskComment, getDeveloperTaskComments } from "../../store/task.slice";

interface Props {
  task: DeveloperTaskDetail;
  projectId: string;
  onClose: () => void;
}

const DeveloperTaskDetailModal = ({ task, projectId, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { comments, commentsLoading } = useAppSelector(
    (state) => state.developerTask
  );

  const [commentText, setCommentText] = useState("");

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
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">TITLE</p>
            <p className="text-sm font-medium text-gray-900">{task.title}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">DESCRIPTION</p>
            <p className="text-sm text-gray-700">{task.description || "—"}</p>
          </div>

          {/* Type, Status, Priority Row */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">TYPE</p>
              <p className="text-sm font-medium text-gray-900">{task.type}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">STATUS</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">PRIORITY</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">DUE DATE</p>
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

          {/* Comments Section */}
          <div className="border-t border-gray-100 pt-3 mt-1">
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments ({comments.length})
            </h3>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mb-2">
              {commentsLoading ? (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">No comments yet</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-blue-700">
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

            <div className="flex gap-2 items-center">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Write a comment..."
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className={`bg-blue-600 text-white p-1.5 rounded-lg transition-all ${
                  !commentText.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700 active:scale-95"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTaskDetailModal;