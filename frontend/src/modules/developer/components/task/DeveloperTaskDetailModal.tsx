import type { DeveloperTaskDetail } from "../../types/task.type";

interface Props {
  task: DeveloperTaskDetail;
  onClose: () => void;
}

const DeveloperTaskDetailModal = ({ task, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Title</p>
            <p className="font-medium">{task.title}</p>
          </div>

          <div>
            <p className="text-gray-500">Description</p>
            <p>{task.description || "—"}</p>
          </div>

  <div>
    <p className="text-gray-500">Type</p>
    <p className="font-medium">{task.type}</p>
  </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{task.status}</p>
            </div>

            <div>
              <p className="text-gray-500">Priority</p>
              <p className="font-medium">{task.priority}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500">Due Date</p>
            <p>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTaskDetailModal;
