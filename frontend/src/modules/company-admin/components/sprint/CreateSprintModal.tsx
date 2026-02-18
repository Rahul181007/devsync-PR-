import { useState } from "react";
import { useAppDispatch } from "../../../../store/hook";
import { createSprint } from "../../store/sprint.slice";
import toast from "react-hot-toast";

interface Props {
    isOpen:boolean;
    onClose:()=>void;
    projectId:string;
}

export const CreateSprintModal=({
   isOpen,
   onClose,
   projectId 
}:Props)=>{
 const dispatch=useAppDispatch();
 const [name,setName]=useState("");
 const [goal,setGoal]=useState("");
 const [startDate,setStartDate]=useState("");
 const [endDate,setEndDate]=useState("");

 if(!isOpen)return null;
const handleSubmit = async () => {
  const result = await dispatch(
    createSprint({
      projectId,
      data: {
        name,
        goal: goal || null,
        startDate,
        endDate
      }
    })
  );

  if (createSprint.fulfilled.match(result)) {
    toast.success("Sprint created successfully");
    onClose();
  }

  if (createSprint.rejected.match(result)) {
    toast.error(result.payload as string);
  }
};

return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4">
        <h2 className="text-lg font-semibold">
          Create Sprint
        </h2>

        <input
          type="text"
          placeholder="Sprint Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Sprint Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};