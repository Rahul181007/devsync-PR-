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
    const developers=selectedProject?.members.filter((member)=>member.role==="DEVELOPER")??[]
    useEffect(()=>{
        if(isOpen){
            dispatch(getProjectTasks(projectId))

        }
    },[dispatch,isOpen,projectId])

    if(!isOpen)return null
const backlogTasks = tasks.filter(
  (task) =>
    task.status === "BACKLOG" &&
    !task.sprintId
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

        const result=await dispatch(
            planSprintTasks({
                projectId,data:{
                    sprintId,
                    tasks:selectedTasks
                }
            })
        )

            if (planSprintTasks.fulfilled.match(result)) {
      toast.success("Tasks added to sprint");
      onClose();
    }

    if (planSprintTasks.rejected.match(result)) {
      toast.error(result.payload as string);
    }
    }
return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-[600px] rounded-xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">
          Plan Sprint Tasks
        </h2>

        {backlogTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{task.title}</span>

<select
  value={
    selectedTasks.find((t) => t.taskId === task.id)?.developerId || ""
  }
  onChange={(e) =>
    handleAssign(task.id, e.target.value)
  }
  className="border p-1 rounded text-sm"
>
  <option value="">Assign Developer</option>

  {developers.map((member) => (
    <option
      key={member.user.id}
      value={member.user.id}
    >
      {member.user.name}
    </option>
  ))}
</select>


          </div>
        ))}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};