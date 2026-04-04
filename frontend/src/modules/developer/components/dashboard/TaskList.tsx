import type { DeveloperTaskItem } from "../../types/dashboard.types";

interface Props {
  tasks: DeveloperTaskItem[];
}

const TaskList = ({ tasks }: Props) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-50 text-red-700 ring-1 ring-red-600/10";
      case "MEDIUM":
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-600/10";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10";
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          My Tasks
        </h2>
        {tasks.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No tasks available</p>
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center justify-between rounded-lg p-3 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            {/* LEFT */}
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="shrink-0 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(task.priority)}`} />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                  {task.title}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {task.projectName}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right space-y-1 ml-4">
              {/* Priority */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>

              {/* Due Date */}
              <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;