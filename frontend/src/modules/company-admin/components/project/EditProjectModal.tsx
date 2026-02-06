import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateProject } from "../../store/project.slice";

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
  return date.split("T")[0]; // YYYY-MM-DD
};


const [form, setForm] = useState(() => ({
  name: selectedProject?.name ?? "",
  description: selectedProject?.description ?? "",
  startDate: toDateInputValue(selectedProject?.startDate),
  endDate: toDateInputValue(selectedProject?.endDate),
  status: selectedProject?.status ?? "ACTIVE",
}));


  /* ================= Prefill ================= */



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
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
            <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <Dialog.Title className="text-lg font-semibold">
                  Edit Project
                </Dialog.Title>
                <button onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ARCHIVED">Archived</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
