import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getProjectTasks } from "../../store/task.slice";
import toast from "react-hot-toast";
import { planSprintTasks } from "../../store/sprint.slice";

interface Props{
    isOpen:boolean;
    onClose:()=>void;
    projectId:string;
    sprintId:string
}
interface Selection {
    taskId:string;
    developerId:string
}

export const PlanSprintModal=({
    isOpen,
    onClose,
    projectId,
    sprintId
}:Props)=>{
    const dispatch=useAppDispatch();

    const {tasks}=useAppSelector((state)=>state.companyAdminTask)
    const {selectedProject}=useAppSelector((state)=>state.project)
    const [selectedTasks,setSelectedTasks]=useState<Selection[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false);
    const developers=selectedProject?.members.filter((member)=>member.role==="DEVELOPER")??[]
    
    useEffect(()=>{
        if(isOpen){
            dispatch(getProjectTasks(projectId))
            // Reset selection when modal opens
            setSelectedTasks([]);
        }
    },[dispatch,isOpen,projectId])

    if(!isOpen)return null

const backlogTasks = tasks.filter(
  (task) =>
    task.status === "BACKLOG" &&
    !task.sprintId &&
    (task.type === "TASK" || task.type === "BUG")
);

    const handleAssign=(taskId:string,developerId:string)=>{
        setSelectedTasks((prev)=>{
            const existing=prev.find((t)=>t.taskId===taskId)
            if(existing){
                return prev.map((t)=>t.taskId===taskId?{...t,developerId}:t)
            }
            return [...prev,{taskId,developerId}]
        })
    }

    const handleSubmit=async()=>{
        if(selectedTasks.length===0){
            toast.error("Select at least one task");
            return;
        }

        setIsSubmitting(true);
        try {
            const result=await dispatch(
                planSprintTasks({
                    projectId,data:{
                        sprintId,
                        tasks:selectedTasks
                    }
                })
            );

            if (planSprintTasks.fulfilled.match(result)) {
                toast.success("Tasks added to sprint");
                onClose();
            }

            if (planSprintTasks.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedCount = () => {
        return selectedTasks.length;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                {/* Header with gradient */}
                <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Plan Sprint Tasks</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Select backlog tasks to add to this sprint
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors text-xl font-medium"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* Stats Bar */}
                    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Backlog Tasks:</span>
                            <span className="text-sm font-semibold text-gray-900">{backlogTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Selected:</span>
                            <span className="text-sm font-semibold text-blue-600">{getSelectedCount()}</span>
                        </div>
                    </div>
                </div>

                {/* Task List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {backlogTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No backlog tasks available</h3>
                            <p className="text-sm text-gray-500">All tasks are already assigned to sprints</p>
                        </div>
                    ) : (
                        backlogTasks.map((task) => {
                            const selectedTask = selectedTasks.find((t) => t.taskId === task.id);
                            
                            return (
                                <div
                                    key={task.id}
                                    className={`border rounded-xl p-4 transition-all ${
                                        selectedTask 
                                            ? "border-blue-300 bg-blue-50/50 shadow-sm" 
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Task Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {task.title}
                                                </h3>
                                                {task.priority && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        task.priority === "HIGH" ? "bg-red-100 text-red-700" :
                                                        task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-green-100 text-green-700"
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {task.code && (
                                                <p className="text-xs text-gray-400 font-mono">
                                                    {task.code}
                                                </p>
                                            )}
                                        </div>

                                        {/* Assignee Selection */}
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedTask?.developerId || ""}
                                                onChange={(e) =>
                                                    handleAssign(task.id, e.target.value)
                                                }
                                                className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                                            >
                                                <option value="">Select Developer</option>
                                                {developers.map((member) => (
                                                    <option
                                                        key={member.user.id}
                                                        value={member.user.id}
                                                    >
                                                        {member.user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            {selectedTask && (
                                                <div className="text-blue-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer with Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {getSelectedCount() > 0 ? (
                                <span className="flex items-center gap-1">
                                    <span className="font-medium text-blue-600">{getSelectedCount()}</span>
                                    {" "}task{getSelectedCount() !== 1 ? 's' : ''} selected
                                </span>
                            ) : (
                                <span>No tasks selected</span>
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedTasks.length === 0 || isSubmitting}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Planning...
                                    </>
                                ) : (
                                    'Plan Sprint'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};