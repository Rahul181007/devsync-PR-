import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createTask, getProjectTasks } from "../../store/task.slice";
import toast from "react-hot-toast";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  projectId,
}: CreateTaskModalProps) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"EPIC" | "STORY" | "TASK" | "BUG">("TASK");
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const { tasks } = useAppSelector((state) => state.companyAdminTask);

  const parentTypeMap = {
    STORY: "EPIC",
    TASK: "STORY",
    BUG: "TASK",
  } as const;

  const requiredParentType = parentTypeMap[type as keyof typeof parentTypeMap];

  const parentTasks =
    requiredParentType
      ? tasks.filter((t) => t.type === requiredParentType)
      : [];
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    console.log({
      title,
      description,
      type,
      priority,
      dueDate
    });
    setIsSubmitting(true);

    try {
      const result = await dispatch(
        createTask({
          projectId,
          data: {
            title,
            description,
            type,
            priority,
            parentId,
            dueDate: dueDate || null,
          },
        })
      );

      // ✅ Success
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully");

        dispatch(getProjectTasks(projectId));
        onClose();
      }

      // ❌ Error
      if (createTask.rejected.match(result)) {
        toast.error(result.payload as string || "Failed to create task");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = title.trim() && description.trim();

  // Priority options with colors
  const priorityOptions = [
    { value: "LOW", label: "Low", color: "text-green-600 bg-green-50 border-green-200" },
    { value: "MEDIUM", label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    { value: "HIGH", label: "High", color: "text-red-600 bg-red-50 border-red-200" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors text-xl font-medium"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Add a new task to this project</p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Title
              <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Enter task title"
              autoFocus
            />
            {!title.trim() && title.length > 0 && (
              <p className="text-xs text-red-500 mt-1">Title is required</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe the task in detail..."
            />
            {!description.trim() && description.length > 0 && (
              <p className="text-xs text-red-500 mt-1">Description is required</p>
            )}
          </div>

          {/* Task Type Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Task Type</label>

            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value as "EPIC" | "STORY" | "TASK" | "BUG";
                setType(newType);
                setParentId(null);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="TASK">Task</option>
              <option value="STORY">Story</option>
              <option value="EPIC">Epic</option>
              <option value="BUG">Bug</option>
            </select>
          </div>

          {requiredParentType && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Parent {requiredParentType}
              </label>

              <select
                value={parentId ?? ""}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select parent {requiredParentType}</option>

                {parentTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.code} — {task.title}
                  </option>
                ))}
              </select>

              {parentTasks.length === 0 && (
                <p className="text-xs text-gray-500">
                  No {requiredParentType} available in this project
                </p>
              )}
            </div>
          )}
          {/* Priority and Due Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Priority preview */}
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${priority === "HIGH" ? "bg-red-50 text-red-700" :
                    priority === "MEDIUM" ? "bg-yellow-50 text-yellow-700" :
                      "bg-green-50 text-green-700"
                  }`}>
                  {priority.charAt(0) + priority.slice(1).toLowerCase()} priority
                </span>
              </div>
            </div>

            {/* Due Date Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {new Date(dueDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Footer with Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
