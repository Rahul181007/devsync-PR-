import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createTask, getProjectTasks } from "../../store/task.slice";
import toast from "react-hot-toast";
import InputField from "../../../../shared/components/InputField";

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
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [storyPoints, setStoryPoints] = useState<number | "">("");
  const { tasks } = useAppSelector((state) => state.companyAdminTask);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    parentId?: string;
    storyPoints?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setParentId(null);
      setStoryPoints("");
      setErrors({});
    }
  }, [isOpen]);

  const parentTypeMap = {
    STORY: "EPIC",
    TASK: "STORY",
    BUG: "STORY",
  } as const;

  const requiredParentType = parentTypeMap[type as keyof typeof parentTypeMap];

  const parentTasks =
    requiredParentType
      ? tasks.filter((t) => t.type === requiredParentType)
      : [];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if ((type === "TASK" || type === "BUG") && !parentId) {
      newErrors.parentId = `${type} must have a parent Story`;
    }

    if (type === "STORY" && !storyPoints) {
      newErrors.storyPoints = "Story points required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
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
            estimatedTime:
              estimatedTime !== ""
                ? Math.round(estimatedTime * 60)
                : undefined,
            storyPoints:
              type === "STORY"
                ? Number(storyPoints)
                : null,
          },
        })
      );

      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully");
        dispatch(getProjectTasks(projectId));
        onClose();
      }

      if (createTask.rejected.match(result)) {
        toast.error(result.payload as string || "Failed to create task");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    title.trim() &&
    description.trim() &&
    (type === "STORY" ? storyPoints : true) &&
    (type === "TASK" || type === "BUG" ? parentId : true);

  const priorityOptions = [
    { value: "LOW", label: "Low", color: "text-green-600 bg-green-50 border-green-200" },
    { value: "MEDIUM", label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    { value: "HIGH", label: "High", color: "text-red-600 bg-red-50 border-red-200" },
  ];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "HIGH": return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Create New Task</h2>
              <p className="text-xs text-gray-500 mt-0.5">Add a new task to this project</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              Title
              <span className="text-red-500">*</span>
            </label>
            <InputField
              value={title}
              onChange={(value) => {
                setTitle(value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Enter task title"
              error={errors.title}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white focus:bg-white resize-none"
              placeholder="Describe the task in detail..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Task Type Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Task Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as "EPIC" | "STORY" | "TASK" | "BUG";
                  setType(newType);
                  setParentId(null);

                  if (newType !== "STORY") {
                    setStoryPoints("");
                  }
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
              >
                <option value="TASK">Task</option>
                <option value="STORY">Story</option>
                <option value="EPIC">Epic</option>
                <option value="BUG">Bug</option>
              </select>
            </div>

            {/* Priority Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="mt-1">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                  {priority.charAt(0) + priority.slice(1).toLowerCase()} priority
                </span>
              </div>
            </div>
          </div>

          {/* Parent Field */}
          {requiredParentType && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Parent {requiredParentType}
              </label>
              <select
                value={parentId ?? ""}
                onChange={(e) => setParentId(e.target.value || null)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
              >
                <option value="">Select parent {requiredParentType}</option>
                {parentTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    [{task.type}] {task.code} — {
                      task.title.length > 30
                        ? task.title.substring(0, 30) + '...'
                        : task.title
                    }
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.parentId}
                </p>
              )}
              {parentTasks.length === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md mt-1">
                  No {requiredParentType} available in this project
                </p>
              )}
            </div>
          )}

          {/* Two Column Grid for Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Due Date Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
                min={new Date().toISOString().split('T')[0]}
              />
              {dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Estimated Time Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Est. Time (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={estimatedTime}
                onChange={(e) =>
                  setEstimatedTime(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
                placeholder="e.g. 2"
              />
              <p className="text-xs text-gray-400">
                Enter time in hours
              </p>
            </div>

            {type === "STORY" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Story Points
                </label>
                <select
                  value={storyPoints}
                  onChange={(e) =>
                    setStoryPoints(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                >
                  <option value="">Select points</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={13}>13</option>
                </select>
                {errors.storyPoints && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.storyPoints}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50/80 px-5 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
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