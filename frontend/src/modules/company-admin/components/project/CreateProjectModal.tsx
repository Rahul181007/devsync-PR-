import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { fetchDevelopers } from "../../store/developer.slice";
import { createProject } from "../../store/project.slice";

interface CreateProjectModalProps{
    open:boolean;
    onClose:()=>void;
    onCreated?:()=> void;
}

const CreateProjectModal=({
    open,
    onClose,
    onCreated
}:CreateProjectModalProps)=>{
    const dispatch=useAppDispatch();
    const {loading}=useAppSelector(state=>state.project)
    const {items:developers}=useAppSelector(state=>state.companyAdminDevelopers)

    const [name,setName]=useState("");
    const [description,setDescription]=useState('')
    const [selectMembers,setSelectMembers]=useState<string[]>([])
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');

    useEffect(()=>{
        if(open){
            dispatch(fetchDevelopers({page:1,limit:100}))
        }
    },[dispatch,open])

    if(!open) return null;
    const toggleMember=(id:string)=>{
        setSelectMembers((prev)=>
            prev.includes(id)
            ?prev.filter((m)=>m!==id)
            :[...prev,id]
        )
    }
    const handleSubmit=async ()=>{
        if(startDate && endDate && new Date(endDate)<new Date(startDate)){
            alert('end Date cannot be before start date');
        return 
        }
 await dispatch(
  createProject({
    name,
    description: description || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    members: selectMembers.map((id) => ({
      userId: id
    }))
  })
);

       onCreated?.();
       onClose();

       setName('');
       setDescription('');
       setStartDate("");
       setEndDate("");
       setSelectMembers([])
    }
     return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Create Project
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Optional description"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Developers
            </label>

            <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
              {developers.map((dev) => (
                <label
                  key={dev.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectMembers.includes(dev.id)}
                    onChange={() => toggleMember(dev.id)}
                  />
                  <span>{dev.name}</span>
                </label>
              ))}

              {developers.length === 0 && (
                <p className="text-sm text-gray-500">
                  No developers available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={loading || !name.trim()}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default CreateProjectModal;