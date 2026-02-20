import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getProjectTasks } from "../../store/task.slice";
import { TaskDetailModal } from "../../components/task/TaskDetailModal";
import { CreateTaskModal } from "../../components/task/CreateTaskModal";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface ProjectTasksPageProps {
    projectId: string;
}

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

    return (
        <>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Tasks</h2>

                    <button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                        + Add Task
                    </button>

                </div>

                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 text-sm text-gray-500 border-b pb-2">
                    <span>Title</span>
                    <span>Assignee</span>
                    <span>Priority</span>
                    <span>Status</span>
                    <span>Due Date</span>
                    <span>Action</span>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="p-6 flex justify-center">
                        <Spinner size="lg" />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="py-6 text-center text-sm text-red-500">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && tasks.length === 0 && (
                    <div className="py-8 text-center text-gray-500 text-sm">
                        No tasks yet for this project.
                    </div>
                )}

                {/* Task Rows */}
                <div className="divide-y">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => {
                                setSelectedTaskId(task.id);
                                setIsTaskModalOpen(true);
                            }}
                            className="grid grid-cols-6 gap-4 py-3 text-sm items-center hover:bg-gray-50 cursor-pointer"
                        >
                            <span className="font-medium">{task.title}</span>

                            <span>
                                {task.assignee ? task.assignee.name : "—"}
                            </span>

                            <span>{task.priority}</span>

                            <span>{task.status}</span>

                            <span>
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString()
                                    : "—"}
                            </span>

                            <span className="text-blue-600 text-xs">
                                View
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= Task Detail Modal ================= */}
            <TaskDetailModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
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
