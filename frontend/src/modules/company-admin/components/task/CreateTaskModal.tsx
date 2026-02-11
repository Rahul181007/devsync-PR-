import { useState } from "react";
import { useAppDispatch } from "../../../../store/hook";
import { createTask, getProjectTasks } from "../../store/task.slice";

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
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const [dueDate, setDueDate] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    await dispatch(
      createTask({
        projectId,
        data: {
          title,
          description,
          priority,
          dueDate: dueDate || null,
        },
      })
    );

    dispatch(getProjectTasks(projectId));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Task</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm text-gray-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm text-gray-500">Priority</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm text-gray-500">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

