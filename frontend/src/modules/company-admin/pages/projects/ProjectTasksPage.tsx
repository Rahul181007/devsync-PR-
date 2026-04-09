import { useEffect, useState, type JSX } from "react";
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
    PauseCircleIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    SparklesIcon,
    FolderIcon,
    FlagIcon
} from "@heroicons/react/24/outline";
import {
    ClockIcon as ClockSolidIcon,
    CheckCircleIcon as CheckCircleSolidIcon,
    PlayCircleIcon as PlayCircleSolidIcon,
    PauseCircleIcon as PauseCircleSolidIcon
} from "@heroicons/react/24/solid";

import { EditTaskModal } from "../../components/task/EditTaskModal";
import type { TaskListItem, TaskAssignee } from "../../types/task.types";

interface ProjectTasksPageProps {
    projectId: string;
}

type TaskTreeItem = TaskListItem & {
    children: TaskTreeItem[];
};

// Enhanced Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
    const priorityConfig = {
        high: {
            color: "bg-gradient-to-r from-red-50 to-red-100/80 text-red-700 border-red-200",
            icon: FlagIcon,
            label: "High"
        },
        medium: {
            color: "bg-gradient-to-r from-yellow-50 to-yellow-100/80 text-yellow-700 border-yellow-200",
            icon: FlagIcon,
            label: "Medium"
        },
        low: {
            color: "bg-gradient-to-r from-green-50 to-green-100/80 text-green-700 border-green-200",
            icon: FlagIcon,
            label: "Low"
        },
    };

    const config = priorityConfig[priority.toLowerCase() as keyof typeof priorityConfig] || priorityConfig.medium;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{priority}</span>
        </span>
    );
};



const TypeBadge = ({ type }: { type: string }) => {
    const config = {
        epic: {
            color: "bg-purple-100 text-purple-700 border-purple-200",
            icon: SparklesIcon,
            label: "Epic",
        },
        story: {
            color: "bg-blue-100 text-blue-700 border-blue-200",
            icon: FolderIcon,
            label: "Story",
        },
        task: {
            color: "bg-gray-100 text-gray-700 border-gray-200",
            icon: ClockIcon,
            label: "Task",
        },
        bug: {
            color: "bg-red-100 text-red-700 border-red-200",
            icon: ExclamationCircleIcon,
            label: "Bug",
        },
    };

    const cfg = config[type.toLowerCase() as keyof typeof config] || config.task;
    const Icon = cfg.icon;

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md ${cfg.color}`}
        >
            <Icon className="w-3 h-3" />
            {cfg.label}
        </span>
    );
};



// Enhanced Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        "todo": {
            color: "bg-gradient-to-r from-gray-50 to-gray-100/80 text-gray-700 border-gray-200",
            icon: ClockIcon,
            solidIcon: ClockSolidIcon,
            label: "To Do"
        },
        "in-progress": {
            color: "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-700 border-blue-200",
            icon: PlayCircleIcon,
            solidIcon: PlayCircleSolidIcon,
            label: "In Progress"
        },
        "review": {
            color: "bg-gradient-to-r from-purple-50 to-purple-100/80 text-purple-700 border-purple-200",
            icon: PauseCircleIcon,
            solidIcon: PauseCircleSolidIcon,
            label: "Review"
        },
        "done": {
            color: "bg-gradient-to-r from-green-50 to-green-100/80 text-green-700 border-green-200",
            icon: CheckCircleIcon,
            solidIcon: CheckCircleSolidIcon,
            label: "Done"
        },
    };

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.todo;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{status.replace('-', ' ')}</span>
        </span>
    );
};



// Due date indicator component
const DueDateIndicator = ({ dueDate,status }: { dueDate: string | null;status: string; }) => {
    if (!dueDate) return <span className="text-gray-400">—</span>;


    const isCompleted=status==="COMPLETED"
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let color = "text-gray-600";
    let bgColor = "bg-gray-50";
    let icon = CalendarIcon;

    if (!isCompleted &&  diffDays < 0) {
        color = "text-red-600";
        bgColor = "bg-red-50";
        icon = ExclamationCircleIcon;
    } else if (diffDays <= 2) {
        color = "text-orange-600";
        bgColor = "bg-orange-50";
        icon = ClockIcon;
    }

    const Icon = icon;
    const formattedDate = due.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: due.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${bgColor} ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            {formattedDate}
            {!isCompleted&&diffDays < 0 && <span className="ml-1">(Overdue)</span>}
            {!isCompleted &&diffDays === 0 && <span className="ml-1">(Today)</span>}
            {!isCompleted &&diffDays === 1 && <span className="ml-1">(Tomorrow)</span>}
        </span>
    );
};



// Fixed Assignee avatar component
const AssigneeAvatar = ({ assignee }: { assignee: TaskAssignee | null }) => {
    if (!assignee) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Unassigned</span>
            </div>
        );
    }

    const initials = assignee.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex items-center gap-2">
            {assignee.avatar ? (
                <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                />
            ) : (
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    {initials}
                </div>
            )}
            <span className="text-sm text-gray-700 truncate max-w-[120px]">{assignee.name}</span>
        </div>
    );
};




const ProjectTasksPage = ({ projectId }: ProjectTasksPageProps) => {
    const dispatch = useAppDispatch();
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

    const { tasks, loading, error } = useAppSelector(
        (state) => state.companyAdminTask
    );

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getProjectTasks(projectId));
    }, [dispatch, projectId]);

    const toggleTaskExpand = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const buildTaskTree = (): TaskTreeItem[] => {
        const map = new Map<string, TaskTreeItem>();
        const roots: TaskTreeItem[] = [];

        tasks.forEach((task) => {
            map.set(task.id, { ...task, children: [] });
        });

        map.forEach((task) => {
            if (task.parentId) {
                const parent = map.get(task.parentId);
                if (parent) {
                    parent.children.push(task);
                }
            } else {
                roots.push(task);
            }
        });

        return roots;
    };

    const taskTree = buildTaskTree();

    const renderTasks = (taskList: TaskTreeItem[], level = 0): JSX.Element[] => {
        return taskList.map((task) => {
            const hasChildren = task.children.length > 0;
            const isExpanded = expandedTasks.has(task.id);

            return (
                <div key={task.id} className="group">
                    <div
                        onClick={() => {
                            setSelectedTaskId(task.id);
                            setIsTaskModalOpen(true);
                        }}
                        className={`
                            grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-3
                            text-sm hover:bg-linear-to-r hover:from-blue-50/50 hover:to-transparent 
                            cursor-pointer transition-all duration-200
                            border-l-2 border-l-transparent hover:border-l-blue-500
                            ${level > 0 ? 'bg-gray-50/30' : ''}
                        `}
                        style={{ paddingLeft: `${level * 32 + 16}px` }}
                    >
                        {/* Title with expand/collapse */}
                        <div className="md:col-span-3 flex items-center gap-2">
                            {hasChildren && (
                                <button
                                    onClick={(e) => toggleTaskExpand(task.id, e)}
                                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                                >
                                    {isExpanded ? (
                                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            )}
                            {!hasChildren && <div className="w-6" />}
                            <div className="flex items-center gap-2">
                                <TypeBadge type={task.type} />

                                <span className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {task.title}
                                </span>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div className="md:col-span-2">
                            <AssigneeAvatar assignee={task.assignee} />
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
                            <DueDateIndicator 
                            dueDate={task.dueDate}
                            status={task.status} 
                            />
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-1 flex items-center justify-end gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTaskId(task.id);
                                    setIsTaskModalOpen(true);
                                }}
                                className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                                View
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditTaskId(task.id);
                                    setIsEditTaskOpen(true);
                                }}
                                className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Children tasks */}
                    {hasChildren && isExpanded && (
                        <div className="border-l-2 border-l-blue-200 ml-8">
                            {renderTasks(task.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Calculate task statistics
const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status.toLowerCase() === "todo").length,
    inProgress: tasks.filter(t => t.status.toLowerCase() === "in_progress").length,
    review: tasks.filter(t => t.status.toLowerCase() === "submitted").length,
    done: tasks.filter(t => t.status.toLowerCase() === "completed").length,
    overdue: tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < new Date();
    }).length
};

    return (
        <>
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total Tasks</span>
                            <FolderIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{taskStats.total}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">To Do</span>
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{taskStats.todo}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">In Progress</span>
                            <PlayCircleIcon className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{taskStats.inProgress}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Done</span>
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{taskStats.done}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Overdue</span>
                            <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{taskStats.overdue}</p>
                    </div>
                </div>

                {/* Main Tasks Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header with gradient background */}
                    <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Project Tasks</h2>
                                    <p className="text-sm text-gray-500">Manage and track all tasks for this project</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsCreateTaskOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Add New Task</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Header - Hidden on mobile */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                        <span className="col-span-3">Task Title</span>
                        <span className="col-span-2">Assignee</span>
                        <span className="col-span-2">Priority</span>
                        <span className="col-span-2">Status</span>
                        <span className="col-span-2">Due Date</span>
                        <span className="col-span-1 text-right">Actions</span>
                    </div>

                    {/* Content Area - Removed min-h to eliminate extra whitespace */}
                    <div>
                        {/* Loading State */}
                        {loading && (
                            <div className="py-16 flex justify-center items-center">
                                <div className="text-center">
                                    <div className="relative">
                                        <Spinner size="lg" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-600">Loading tasks...</p>
                                    <p className="text-xs text-gray-400">Please wait while we fetch your tasks</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="py-16 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-red-50 to-red-100 mb-4">
                                    <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Failed to load tasks</h3>
                                <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{error}</p>
                                <button
                                    onClick={() => dispatch(getProjectTasks(projectId))}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    <PlayCircleIcon className="w-4 h-4" />
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && tasks.length === 0 && !error && (
                            <div className="py-16 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 mb-4">
                                    <FolderIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">No tasks yet</h3>
                                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                    Get started by creating your first task for this project. Tasks help you track work and stay organized.
                                </p>
                                <button
                                    onClick={() => setIsCreateTaskOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Create your first task
                                </button>
                            </div>
                        )}

                        {/* Task Rows */}
                        {!loading && tasks.length > 0 && (
                            <div className="divide-y divide-gray-100">
                                {renderTasks(taskTree)}
                            </div>
                        )}
                    </div>
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

            {editTaskId && (
                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={() => {
                        setIsEditTaskOpen(false);
                        setEditTaskId(null);
                    }}
                    projectId={projectId}
                    taskId={editTaskId}
                />
            )}
        </>
    );
};

export default ProjectTasksPage;