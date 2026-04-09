import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
    activateSprint,
    completeSprint,
    getProjectSprints,
    getSprintDetail
} from "../../store/sprint.slice";
import { CreateSprintModal } from "./CreateSprintModal";
import toast from "react-hot-toast";
import { PlanSprintModal } from "./PlanSprintModal";
import Spinner from "../../../../shared/components/LoadingSpinner";
import type { TaskListItem } from "../../types/task.types";
import { TaskDetailModal } from "../task/TaskDetailModal";

interface Props {
    projectId: string;
}

const STATUSES = [
    "BACKLOG",
    "TODO",
    "IN_PROGRESS",
    "SUBMITTED",
    "COMPLETED"
];

// Status column configuration
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; dotColor: string }> = {
    "BACKLOG": { color: "text-gray-700", bgColor: "bg-gray-100", dotColor: "bg-gray-400" },
    "TODO": { color: "text-blue-700", bgColor: "bg-blue-50", dotColor: "bg-blue-500" },
    "IN_PROGRESS": { color: "text-yellow-700", bgColor: "bg-yellow-50", dotColor: "bg-yellow-500" },
    "SUBMITTED": { color: "text-purple-700", bgColor: "bg-purple-50", dotColor: "bg-purple-500" },
    "COMPLETED": { color: "text-green-700", bgColor: "bg-green-50", dotColor: "bg-green-500" }
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
    const priorityConfig: Record<string, { color: string; bgColor: string }> = {
        "HIGH": { color: "text-red-700", bgColor: "bg-red-50" },
        "MEDIUM": { color: "text-yellow-700", bgColor: "bg-yellow-50" },
        "LOW": { color: "text-green-700", bgColor: "bg-green-50" },
    };

    const config = priorityConfig[priority] || priorityConfig.MEDIUM;

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            {priority.charAt(0) + priority.slice(1).toLowerCase()}
        </span>
    );
};

export const SprintBoard = ({ projectId }: Props) => {
    const dispatch = useAppDispatch();

    const { sprints, selectedSprint, sprintTasks, loading,
        totalStoryPoints,
        completedStoryPoints,
        progressPercentage
    } =
        useAppSelector((state) => state.companyAdminSprint);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPlanOpen, setIsPlanOpen] = useState(false);
    const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);
    const [unfinishedCount, setUnfinishedCount] = useState(0);
    const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    
    useEffect(() => {
        dispatch(getProjectSprints(projectId));
    }, [dispatch, projectId]);



    const handleSelectSprint = (sprintId: string) => {
        dispatch(getSprintDetail({ projectId, sprintId }));
    };


    const handleOpenTask = (task: TaskListItem) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleActivateSprint = async () => {
        if (!selectedSprint) return;
        const result = await dispatch(activateSprint({
            projectId,
            sprintId: selectedSprint.id
        }));

        if (activateSprint.fulfilled.match(result)) {
            toast.success("Sprint activated successfully");
        }

        if (activateSprint.rejected.match(result)) {
            toast.error(result.payload as string);
        }
    };

    const handleCompleteSprint = () => {
        if (!selectedSprint) return;

const unfinishedTasks = sprintTasks.filter(
  (task) =>
    (task.type === "TASK" || task.type === "BUG") &&
    task.status !== "COMPLETED"
);

        if (unfinishedTasks.length > 0) {
            setUnfinishedCount(unfinishedTasks.length);
            setIsCompleteConfirmOpen(true);
            return;
        }

        executeCompleteSprint();
    };

    const executeCompleteSprint = async () => {
        if (!selectedSprint) return;

        const result = await dispatch(
            completeSprint({
                projectId,
                sprintId: selectedSprint.id
            })
        );

        if (completeSprint.fulfilled.match(result)) {
            toast.success("Sprint completed successfully");
        }

        if (completeSprint.rejected.match(result)) {
            toast.error(result.payload as string);
        }

        setIsCompleteConfirmOpen(false);
    };

    const groupTasksByStory = (tasks: typeof sprintTasks) => {
        const stories = tasks.filter((t) => t.type === "STORY");

        const taskMap = new Map<string, typeof sprintTasks>();

        for (const task of tasks) {
            if ((task.type === "TASK" || task.type === "BUG") && task.parentId) {
                if (!taskMap.has(task.parentId)) {
                    taskMap.set(task.parentId, []);
                }
                taskMap.get(task.parentId)?.push(task);
            }
        }

        return stories.map((story) => ({
            story,
            tasks: taskMap.get(story.id) || [],
        }));
    };

    return (
        <div className="flex gap-6 h-full">
            {/* ================= Left Sprint List ================= */}
            <div className="w-72 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-fit sticky top-4">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-900">Sprints</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {sprints.length} {sprints.length === 1 ? 'sprint' : 'sprints'}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            New Sprint
                        </button>
                    </div>
                </div>

                <div className="p-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {sprints.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">No sprints yet</p>
                            <p className="text-xs text-gray-400 mt-1">Create your first sprint</p>
                        </div>
                    ) : (
                        sprints.map((sprint) => {
                            const statusConfig = {
                                "PLANNED": "bg-gray-100 text-gray-600",
                                "ACTIVE": "bg-green-100 text-green-700",
                                "COMPLETED": "bg-purple-100 text-purple-700"
                            };
                            const statusColor = statusConfig[sprint.status as keyof typeof statusConfig] || "bg-gray-100 text-gray-600";

                            return (
                                <div
                                    key={sprint.id}
                                    onClick={() => handleSelectSprint(sprint.id)}
                                    className={`relative p-3 rounded-xl cursor-pointer border-2 transition-all overflow-hidden ${selectedSprint?.id === sprint.id
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {/* Blue indicator line - always visible on selected, visible on hover for others */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transition-opacity ${selectedSprint?.id === sprint.id
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                        }`} />

                                    <div className="flex justify-between items-start mb-1.5 pl-1">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                            {sprint.name}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                                            {sprint.status}
                                        </span>
                                    </div>
                                    {sprint.goal && (
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 pl-1">
                                            {sprint.goal}
                                        </p>
                                    )}

                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ================= Right Sprint Board ================= */}
            <div className="flex-1 min-w-0">
                {!selectedSprint && !loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sprint selected</h3>
                        <p className="text-gray-500 mb-6">Select a sprint from the left to view its details and tasks</p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create a Sprint
                        </button>
                    </div>
                )}

                {selectedSprint && (
                    <div className="space-y-5">
                        {/* Sprint Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {selectedSprint.name}
                                        </h2>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selectedSprint.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                                            selectedSprint.status === "PLANNED" ? "bg-gray-100 text-gray-700" :
                                                "bg-purple-100 text-purple-700"
                                            }`}>
                                            {selectedSprint.status}
                                        </span>
                                    </div>

                                    {selectedSprint.goal && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">Goal:</span>
                                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                                {selectedSprint.goal}
                                            </p>
                                        </div>
                                    )}

                                    {/* Progress Section */}
                                    {selectedSprint.status !== "PLANNED" && totalStoryPoints > 0 && (
                                        <div className="mt-4 max-w-md">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                                <span>
                                                    {completedStoryPoints} of {totalStoryPoints} pts completed
                                                </span>
                                                <span>{progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 ml-4">
                                    {selectedSprint.status === "PLANNED" && (
                                        <>
                                            <button
                                                onClick={() => setIsPlanOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Tasks
                                            </button>
                                            <button
                                                onClick={handleActivateSprint}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Activate
                                            </button>
                                        </>
                                    )}

                                    {selectedSprint.status === "ACTIVE" && (
                                        <button
                                            onClick={handleCompleteSprint}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Complete Sprint
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Task Board */}
                        {loading ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex justify-center">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-5 gap-4">
                                {STATUSES.map((status) => {
                                    const tasksByStatus = sprintTasks.filter(
                                        (task) => task.status === status
                                    );
                                    const config = STATUS_CONFIG[status] || STATUS_CONFIG["BACKLOG"];

                                    return (
                                        <div
                                            key={status}
                                            className="bg-gray-50 rounded-xl border border-gray-200 flex flex-col h-[600px]"
                                        >
                                            {/* Column Header */}
                                            <div className={`p-3 rounded-t-xl border-b border-gray-200 ${config.bgColor}`}>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                                                        <h4 className={`text-sm font-semibold ${config.color}`}>
                                                            {status}
                                                        </h4>
                                                    </div>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full bg-white ${config.color}`}>
                                                        {tasksByStatus.length}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Scrollable Task Container */}
                                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                                {tasksByStatus.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-24 text-center">
                                                        <p className="text-xs text-gray-400">No tasks</p>
                                                    </div>
                                                ) : (
                                                    (() => {
                                                        const grouped = groupTasksByStory(sprintTasks);

                                                        return grouped.map(({ story, tasks }) => {
                                                            const filteredTasks = tasks.filter((t) => t.status === status);

                                                            // ❗ show story only if it belongs OR has tasks in this column
                                                            if (filteredTasks.length === 0 && story.status !== status) return null;

                                                            return (
                                                                <div key={story.id} className="space-y-2 mb-3">

                                                                    {/* STORY HEADER */}
                                                                    <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center">
                                                                        <span className="truncate">{story.title}</span>
                                                                        <span className="text-gray-600">
                                                                            {story.storyPoints || 0} pts
                                                                        </span>
                                                                    </div>

                                                                    {/* TASKS */}
                                                                    {filteredTasks.length === 0 ? (
                                                                        <div className="text-xs text-gray-400 pl-2">
                                                                            No tasks
                                                                        </div>
                                                                    ) : (
                                                                        filteredTasks.map((task) => (
                                                                            <div
                                                                                onClick={() => handleOpenTask(task)}
                                                                                className="relative bg-white p-3 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition"
                                                                            >
                                                                                <p className="text-sm font-medium mb-2">{task.title}</p>
                                                                                <p className="text-sm font-medium mb-2">{task.code}</p>
                                                                                <div className="flex justify-between items-center">
                                                                                    <PriorityBadge priority={task.priority} />

                                                                                    {task.assignee && (
                                                                                        <span className="text-xs text-gray-500">
                                                                                            {task.assignee.name}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            );
                                                        });
                                                    })()
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= Modals ================= */}
            <CreateSprintModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                projectId={projectId}
            />

            <PlanSprintModal
                isOpen={isPlanOpen}
                onClose={() => setIsPlanOpen(false)}
                projectId={projectId}
                sprintId={selectedSprint?.id ?? ""}
            />

            {selectedTask && (
                <TaskDetailModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    projectId={projectId}
                    taskId={selectedTask.id}
                />
            )}

            {/* Complete Sprint Confirmation Modal */}
            {isCompleteConfirmOpen && selectedSprint && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                            <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                                <span className="text-xl">⚠️</span>
                                Unfinished Tasks
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-red-600 text-lg">{unfinishedCount}</span>
                                {" "}task{unfinishedCount > 1 ? "s are" : " is"} still incomplete.
                            </p>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                                <p className="text-xs font-medium text-amber-800 uppercase tracking-wider">What will happen:</p>
                                <ul className="text-sm text-amber-700 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 text-lg leading-4">•</span>
                                        <span>Incomplete tasks will move back to backlog</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 text-lg leading-4">•</span>
                                        <span>Sprint will be permanently marked as completed</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setIsCompleteConfirmOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeCompleteSprint}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Complete Anyway
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};