import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getProjectTasks } from "../../store/task.slice";
import { TaskDetailModal } from "../../components/task/TaskDetailModal";
import { CreateTaskModal } from "../../components/task/CreateTaskModal";
import Spinner from "../../../../shared/components/LoadingSpinner";
import { 
  CalendarIcon, 
  UserIcon, 
  PlusIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon
} from "@heroicons/react/24/outline";

interface ProjectTasksPageProps {
    projectId: string;
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    high: { color: "bg-red-100 text-red-700", label: "High" },
    medium: { color: "bg-yellow-100 text-yellow-700", label: "Medium" },
    low: { color: "bg-green-100 text-green-700", label: "Low" },
  };

  const config = priorityConfig[priority.toLowerCase() as keyof typeof priorityConfig] || priorityConfig.medium;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {priority}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    "todo": { color: "bg-gray-100 text-gray-700", icon: ClockIcon },
    "in-progress": { color: "bg-blue-100 text-blue-700", icon: PlayCircleIcon },
    "review": { color: "bg-purple-100 text-purple-700", icon: PauseCircleIcon },
    "done": { color: "bg-green-100 text-green-700", icon: CheckCircleIcon },
  };

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.todo;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

const ProjectTasksPage = ({ projectId }: ProjectTasksPageProps) => {
    const dispatch = useAppDispatch();

    const { tasks, loading, error } = useAppSelector(
        (state) => state.companyAdminTask
    );

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    useEffect(() => {
        dispatch(getProjectTasks(projectId));
    }, [dispatch, projectId]);

    // Check if due date is approaching or passed
    const getDueDateStatus = (dueDate: string | null) => {
        if (!dueDate) return null;
        
        const today = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return "overdue";
        if (diffDays <= 2) return "approaching";
        return "normal";
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                            </span>
                        </div>

                        <button
                            onClick={() => setIsCreateTaskOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                    <span className="col-span-3">Title</span>
                    <span className="col-span-2">Assignee</span>
                    <span className="col-span-2">Priority</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-2">Due Date</span>
                    <span className="col-span-1 text-right">Action</span>
                </div>

                {/* Content Area */}
                <div className="min-h-[200px]">
                    {/* Loading State */}
                    {loading && (
                        <div className="p-12 flex justify-center items-center">
                            <div className="text-center">
                                <Spinner size="lg" />
                                <p className="mt-2 text-sm text-gray-500">Loading tasks...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="text-sm text-red-600 mb-2">{error}</p>
                            <button 
                                onClick={() => dispatch(getProjectTasks(projectId))}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && tasks.length === 0 && !error && (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <CalendarIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No tasks yet</h3>
                            <p className="text-sm text-gray-500 mb-4">Get started by creating your first task for this project.</p>
                            <button
                                onClick={() => setIsCreateTaskOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Create your first task
                            </button>
                        </div>
                    )}

                    {/* Task Rows */}
                    {!loading && tasks.length > 0 && (
                        <div className="divide-y divide-gray-100">
                            {tasks.map((task) => {
                                const dueDateStatus = getDueDateStatus(task.dueDate);
                                
                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => {
                                            setSelectedTaskId(task.id);
                                            setIsTaskModalOpen(true);
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-4 text-sm hover:bg-gray-50 cursor-pointer transition-colors border-l-2 border-l-transparent hover:border-l-blue-500"
                                    >
                                        {/* Title - Full width on mobile */}
                                        <div className="md:col-span-3">
                                            <div className="font-medium text-gray-900 mb-1 md:mb-0">
                                                {task.title}
                                            </div>
                                            {/* Mobile meta info */}
                                            <div className="flex md:hidden flex-wrap gap-2 mt-1">
                                                <StatusBadge status={task.status} />
                                                <PriorityBadge priority={task.priority} />
                                            </div>
                                        </div>

                                        {/* Assignee */}
                                        <div className="md:col-span-2 flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-gray-400 md:hidden" />
                                            <span className="text-gray-600">
                                                {task.assignee ? task.assignee.name : "—"}
                                            </span>
                                        </div>

                                        {/* Priority - Hidden on mobile */}
                                        <div className="hidden md:block md:col-span-2">
                                            <PriorityBadge priority={task.priority} />
                                        </div>

                                        {/* Status - Hidden on mobile */}
                                        <div className="hidden md:block md:col-span-2">
                                            <StatusBadge status={task.status} />
                                        </div>

                                        {/* Due Date */}
                                        <div className="md:col-span-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className={`w-4 h-4 md:hidden ${
                                                    dueDateStatus === 'overdue' ? 'text-red-400' : 
                                                    dueDateStatus === 'approaching' ? 'text-yellow-400' : 
                                                    'text-gray-400'
                                                }`} />
                                                {task.dueDate ? (
                                                    <span className={`flex items-center gap-1 ${
                                                        dueDateStatus === 'overdue' ? 'text-red-600 font-medium' : 
                                                        dueDateStatus === 'approaching' ? 'text-yellow-600' : 
                                                        'text-gray-600'
                                                    }`}>
                                                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                        {dueDateStatus === 'overdue' && (
                                                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full ml-1">
                                                                Overdue
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">No due date</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="md:col-span-1 flex justify-end">
                                            <span className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg md:bg-transparent md:px-0">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <TaskDetailModal
                isOpen={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setSelectedTaskId(null);
                }}
                projectId={projectId}
                taskId={selectedTaskId}
            />
            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                projectId={projectId}
            />
        </>
    );
};

export default ProjectTasksPage;