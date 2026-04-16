import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { fetchDevelopers } from "../../store/developer.slice";
import { createProject } from "../../store/project.slice";
import { toast } from "react-hot-toast";
import { projectWithMembersSchema } from "../../validator/cretaeProject.validator";
import InputField from "../../../../shared/components/InputField";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";
interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateProjectModal = ({
  open,
  onClose,
  onCreated
}: CreateProjectModalProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.project)
  const { items: developers } = useAppSelector(state => state.companyAdminDevelopers)
  const [selectMembers, setSelectMembers] = useState<string[]>([])

  const form = useFormValidation(
    {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      members: [] as { userId: string }[],
    },
    projectWithMembersSchema,
    async (vals) => {
      const result = await dispatch(
        createProject({
          name: vals.name,
          description: vals.description || undefined,
          startDate: vals.startDate || undefined,
          endDate: vals.endDate || undefined,
          members: selectMembers.map((id) => ({ userId: id }))
        })
      );

      if (createProject.fulfilled.match(result)) {
        toast.success("Project created successfully");
        onCreated?.();
        onClose();


        setSelectMembers([]);
      }

      if (createProject.rejected.match(result)) {
        toast.error(result.payload as string || "Failed");
      }
    }
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = form;

  useEffect(() => {
    if (open) {
      dispatch(fetchDevelopers({ page: 1, limit: 100 }))
    }
  }, [dispatch, open])

const handleClose = () => {
  reset();              
  setSelectMembers([]); 
  onClose();
};


  if (!open) return null;
  const toggleMember = (id: string) => {
    setSelectMembers((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    )
  }



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Project
            </h2>
            <button
               onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create a new project
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>


            <InputField
              value={values.name}
              onChange={(val) => handleChange("name", val)}
              onBlur={() => handleBlur("name")}
              error={touched.name ? errors.name : ""}
            />


          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-none"
              placeholder="Describe the project objectives..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={values.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  onBlur={() => handleBlur("startDate")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all scheme-light"
                />
                {touched.startDate && errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
                )}
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={values.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  onBlur={() => handleBlur("endDate")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all scheme-light"
                />
                {touched.endDate && errors.endDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                )}
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign Developers
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                {developers.length > 0 ? (
                  developers.map((dev) => (
                    <label
                      key={dev.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectMembers.includes(dev.id)}
                        onChange={() => toggleMember(dev.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500/20 transition-colors"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {dev.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">{dev.name}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-sm text-gray-400">
                      No developers available
                    </p>
                  </div>
                )}
              </div>
            </div>
            {selectMembers.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {selectMembers.length} developer{selectMembers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/20"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={
              handleSubmit
        }
            className="px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


export default CreateProjectModal;