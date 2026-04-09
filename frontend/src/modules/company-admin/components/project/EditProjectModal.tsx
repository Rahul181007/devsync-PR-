import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateProject } from "../../store/project.slice";
import InputField from "../../../../shared/components/InputField";
import { validateZod } from "../../../../shared/utiils/validateZod";
import { projectSchema } from "../../validator/cretaeProject.validator";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const EditProjectModal = ({
  isOpen,
  onClose,
  projectId,
}: EditProjectModalProps) => {
  const dispatch = useAppDispatch();
  const { selectedProject, loading } = useAppSelector(
    (state) => state.project
  );

  const toDateInputValue = (date?: string | null) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const [form, setForm] = useState(() => ({
    name: selectedProject?.name ?? "",
    description: selectedProject?.description ?? "",
    startDate: toDateInputValue(selectedProject?.startDate),
    endDate: toDateInputValue(selectedProject?.endDate),
    status: selectedProject?.status ?? "ACTIVE",
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };



  const handleSubmit = () => {
    const validation = validateZod(projectSchema, {
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
    });

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    dispatch(
      updateProject({
        projectId,
        data: {
          name: form.name,
          description: form.description || undefined,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          status: form.status,
        },
      })
    );
    onClose();
  };

  if (!selectedProject) return null;

  // Status options with colors
  const statusOptions = [
    { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-700" },
    { value: "ARCHIVED", label: "Archived", color: "bg-gray-100 text-gray-700" },
    { value: "COMPLETED", label: "Completed", color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Edit Project
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Update project details and settings
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Project Name
                    <span className="text-red-500">*</span>
                  </label>
                  <InputField

                    value={form.name}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, name: val }));
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    error={errors.name}
                    placeholder="Enter project name"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                    <span className="text-xs text-gray-400 ml-2">(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe the project purpose and goals..."
                  />
                </div>

                {/* Date Range */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Project Timeline
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Start Date</span>
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">End Date</span>
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        min={form.startDate}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.endDate
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-blue-500"
                          }`}
                      />
                      {errors.endDate && (
                        <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Date Preview */}
                  {form.startDate && form.endDate && !errors.endDate && (
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <span>📅</span>
                        <span>
                          {new Date(form.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} - {new Date(form.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Project Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none bg-white"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Status Preview */}
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusOptions.find(opt => opt.value === form.status)?.color
                      }`}>
                      {statusOptions.find(opt => opt.value === form.status)?.label} status
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  disabled={loading || !form.name.trim()}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};