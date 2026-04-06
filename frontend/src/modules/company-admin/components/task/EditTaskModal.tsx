import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { TaskPriority, TaskType } from "../../types/task.types";
import toast from "react-hot-toast";
import { getTaskDetail, updateTask } from "../../store/task.slice";

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
    dueDate: string | null
    estimatedTime: number | "";
    storyPoints: string | "";
}

export const EditTaskModal = ({
    isOpen,
    onClose,
    projectId,
    taskId,
}: Props) => {
    const dispatch = useAppDispatch();

    const { selectedTask, loading } = useAppSelector(
        (state) => state.companyAdminTask
    );

    console.log(selectedTask)



    const [form, setForm] = useState<EditTaskForm>({
        title: "",
        description: "",
        type: "TASK",
        priority: "MEDIUM",
        dueDate: null,
        estimatedTime: "",
        storyPoints: ""
    });

    // Fetch task when modal opens
    useEffect(() => {
        if (isOpen && taskId) {
            dispatch(getTaskDetail({ projectId, taskId }));
        }
    }, [dispatch, isOpen, projectId, taskId]);


    useEffect(() => {
        if (!isOpen || !selectedTask) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
            title: selectedTask.title,
            description: selectedTask.description,
            type: selectedTask.type,
            priority: selectedTask.priority,
            dueDate: selectedTask.dueDate,
            estimatedTime:
                selectedTask.estimatedTime != null
                    ? selectedTask.estimatedTime / 60
                    : "",
            storyPoints:
                selectedTask.storyPoints != null
                    ? String(selectedTask.storyPoints)
                    : "",
        });
    }, [isOpen, selectedTask]);



    const handleChange = (field: keyof EditTaskForm, value: number | string | null) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            if (form.type === "STORY" && !form.storyPoints) {
                toast.error("Story points required");
                return;
            }
            const result = await dispatch(
                updateTask({
                    projectId,
                    taskId,
                    data: {
                        ...form,
                        estimatedTime:
                            form.estimatedTime !== ""
                                ? Math.round((form.estimatedTime as number) * 60)
                                : undefined,

                        storyPoints:
                            form.type === "STORY"
                                ? Number(form.storyPoints)
                                : undefined,
                    },
                })
            );

            if (updateTask.fulfilled.match(result)) {
                toast.success("Task updated");
                onClose();
            }

            if (updateTask.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-lg">

                <h2 className="text-lg font-semibold">Edit Task</h2>

                {loading ? (
                    <p className="text-sm text-gray-500">Loading task...</p>
                ) : (
                    <>
                        <input
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Task title"
                        />

                        <textarea
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            rows={4}
                            placeholder="Task description"
                        />

                        <select
                            value={form.type}
                            onChange={(e) => {
                                const newType = e.target.value as TaskType;
                                handleChange("type", newType);

                                if (newType !== "STORY") {
                                    handleChange("storyPoints", ""); // reset
                                }
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="TASK">Task</option>
                            <option value="STORY">Story</option>
                            <option value="EPIC">Epic</option>
                            <option value="BUG">Bug</option>
                        </select>

                        <select
                            value={form.priority}
                            onChange={(e) =>
                                handleChange("priority", e.target.value as TaskPriority)
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>

                        <input
                            type="date"
                            value={form.dueDate ? form.dueDate.split("T")[0] : ""}
                            onChange={(e) =>
                                handleChange("dueDate", e.target.value || null)
                            }
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />

                        {/* Estimated Time */}
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
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Estimated time (hours)"
                        />

                        {form.type === "STORY" && (
                            <select
                                value={form.storyPoints}
                                onChange={(e) =>
                                    handleChange("storyPoints", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Select Story Points</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="8">8</option>
                                <option value="13">13</option>
                            </select>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                            >
                                Update Task
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};