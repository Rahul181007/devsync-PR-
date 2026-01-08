import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { clearCompanyError, createWorkspace } from "../../store/company.slice";
import { ROUTES } from "../../../../shared/constants/routes";

const WorkspacePage = () => {
    const navigate=useNavigate();
    const dispatch=useAppDispatch();

    const {loading,error}=useAppSelector((state)=>state.company)
    const [name,setName]=useState("");
    const [domain,setDomain]=useState('');
    const [localError,setLocalError]=useState<string|null>(null);

    useEffect(()=>{
        dispatch(clearCompanyError())
    },[dispatch])
   

    const handleSubmit=async()=>{
        
            setLocalError(null);
            if(!name.trim()){
                setLocalError('Workspace name is required');
                return
            }
           const res=await dispatch(createWorkspace({name:name.trim(),domain:domain.trim()||undefined}))
          if(createWorkspace.fulfilled.match(res)){
            navigate(ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_BRANDING,{replace:true})
          }
        
    }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">Create Workspace</h2>

      {(localError || error) && (
        <p className="text-red-500 mb-3">
          {localError || error}
        </p>
      )}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Workspace name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Domain (optional)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading ? "Creating..." : "Create Workspace"}
      </button>
    </div>
  );
}

export default WorkspacePage
