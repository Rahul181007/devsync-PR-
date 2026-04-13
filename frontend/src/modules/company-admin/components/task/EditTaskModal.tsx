import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { TaskPriority, TaskType } from "../../types/task.types";
import toast from "react-hot-toast";
import { getTaskDetail, updateTask, getProjectTasks } from "../../store/task.slice";
import InputField from "../../../../shared/components/InputField";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string;
}

interface EditTaskForm {
    title: string;
    description: string;
    type: TaskType;
    priority: TaskPriority;
    dueDate: string | null;
    estimatedTime: number | "";
    storyPoints: string | "";
    parentId: string | null;
}

export const EditTaskModal = ({
    isOpen,
    onClose,
    projectId,
    taskId,
}: Props) => {
    const dispatch = useAppDispatch();

    const { selectedTask, loading, tasks } = useAppSelector(
        (state) => state.companyAdminTask
    );

    const [form, setForm] = useState<EditTaskForm>({
        title: "",
        description: "",
        type: "TASK",
        priority: "MEDIUM",
        dueDate: null,
        estimatedTime: "",
        storyPoints: "",
        parentId: null,
    });

    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        parentId?: string;
        storyPoints?: string;
    }>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const parentTypeMap = {
        STORY: "EPIC",
        TASK: "STORY",
        BUG: "STORY",
    } as const;

    const requiredParentType = form.type && parentTypeMap[form.type as keyof typeof parentTypeMap];

    const parentTasks = requiredParentType
        ? tasks.filter((t) => t.type === requiredParentType && t.id !== taskId)
        : [];

    const handleClose = () => {
        setErrors({});
        setForm({
            title: "",
            description: "",
            type: "TASK",
            priority: "MEDIUM",
            dueDate: null,
            estimatedTime: "",
            storyPoints: "",
            parentId: null,
        });
        onClose();
    };

    // Fetch task when modal opens
    useEffect(() => {
        if (isOpen && taskId) {
            dispatch(getTaskDetail({ projectId, taskId }));
        }
    }, [dispatch, isOpen, projectId, taskId]);

    useEffect(() => {
        if (!isOpen || !selectedTask) return;

        setForm({
            title: selectedTask.title,
            description: selectedTask.description,
            type: selectedTask.type,
            priority: selectedTask.priority,
            dueDate: selectedTask.dueDate,
            estimatedTime: selectedTask.estimatedTime != null ? selectedTask.estimatedTime / 60 : "",
            storyPoints: selectedTask.storyPoints != null ? String(selectedTask.storyPoints) : "",
            parentId: selectedTask.parentId || null,
        });
    }, [isOpen, selectedTask]);

    const handleChange = (field: keyof EditTaskForm, value: number | string | null) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdate = async () => {
        const newErrors: typeof errors = {};

        if (!form.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!form.description.trim()) {
            newErrors.description = "Description is required";
        }

        if ((form.type === "TASK" || form.type === "BUG") && !form.parentId) {
            newErrors.parentId = `${form.type} must have a parent Story`;
        }

        if (form.type === "STORY" && !form.storyPoints) {
            newErrors.storyPoints = "Story points required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);

        try {
            const result = await dispatch(
                updateTask({
                    projectId,
                    taskId,
                    data: {
                        title: form.title,
                        description: form.description,
                        type: form.type,
                        priority: form.priority,
                        parentId: form.parentId,
                        dueDate: form.dueDate || null,
                        estimatedTime: form.estimatedTime !== "" ? Math.round((form.estimatedTime as number) * 60) : undefined,
                        storyPoints: form.type === "STORY" ? Number(form.storyPoints) : null,
                    },
                })
            );

            if (updateTask.fulfilled.match(result)) {
                toast.success("Task updated successfully");
                dispatch(getProjectTasks(projectId));
                handleClose();
            }

            if (updateTask.rejected.match(result)) {
                toast.error(result.payload as string || "Failed to update task");
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = form.title.trim() &&
        form.description.trim() &&
        (form.type === "STORY" ? form.storyPoints : true) &&
        (form.type === "TASK" || form.type === "BUG" ? form.parentId : true);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-5 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Edit Task</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Update task details</p>
                        </div>
                        <button
                            onClick={handleClose}
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
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Loading task...</span>
                        </div>
                    ) : (
                        <>
                            {/* Title Field */}
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    Title
                                    <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    value={form.title}
                                    onChange={(value) => {
                                        handleChange("title", value);
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
                                    value={form.description}
                                    onChange={(e) => {
                                        handleChange("description", e.target.value);
                                        setErrors((prev) => ({ ...prev, description: undefined }));
                                    }}
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
                                        value={form.type}
                                        onChange={(e) => {
                                            const newType = e.target.value as TaskType;
                                            handleChange("type", newType);
                                            setForm((prev) => ({ ...prev, parentId: null }));

                                            if (newType !== "STORY") {
                                                handleChange("storyPoints", "");
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
                                        value={form.priority}
                                        onChange={(e) =>
                                            handleChange("priority", e.target.value as TaskPriority)
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
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(form.priority)}`}>
                                            {form.priority.charAt(0) + form.priority.slice(1).toLowerCase()} priority
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
                                        value={form.parentId ?? ""}
                                        onChange={(e) => handleChange("parentId", e.target.value || null)}
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
                                        value={form.dueDate ? form.dueDate.split("T")[0] : ""}
                                        onChange={(e) =>
                                            handleChange("dueDate", e.target.value || null)
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
                                    />
                                    {form.dueDate && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(form.dueDate).toLocaleDateString('en-US', {
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
                                        value={form.estimatedTime}
                                        onChange={(e) =>
                                            handleChange(
                                                "estimatedTime",
                                                e.target.value === "" ? "" : Number(e.target.value)
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 hover:bg-white focus:bg-white"
                                        placeholder="e.g. 2"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Enter time in hours
                                    </p>
                                </div>

                                {form.type === "STORY" && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600">
                                            Story Points
                                        </label>
                                        <select
                                            value={form.storyPoints}
                                            onChange={(e) => {
                                                handleChange("storyPoints", e.target.value);
                                                setErrors((prev) => ({ ...prev, storyPoints: undefined }));
                                            }}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                                        >
                                            <option value="">Select points</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="5">5</option>
                                            <option value="8">8</option>
                                            <option value="13">13</option>
                                        </select>
                                        {errors.storyPoints && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.storyPoints}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50/80 px-5 py-3 flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={!isFormValid || isSubmitting || loading}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Updating...</span>
                            </>
                        ) : (
                            'Update Task'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};