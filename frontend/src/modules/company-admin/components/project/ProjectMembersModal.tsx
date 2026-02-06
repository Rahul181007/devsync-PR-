import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Trash2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  removeMemberFromProject,
  addMembersToProject,
} from "../../store/project.slice";
import { fetchDevelopers } from "../../store/developer.slice";

interface ProjectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  mode: "VIEW" | "ADD";
}

export const ProjectMembersModal = ({
  isOpen,
  onClose,
  projectId,
  mode,
}: ProjectMemberModalProps) => {
  const dispatch = useAppDispatch();

  /* ================= PROJECT STATE ================= */
  const { selectedProject, loading } = useAppSelector(
    (state) => state.project
  );

  /* ================= DEVELOPERS STATE ================= */
  const {
    items: developers,
    loading: developersLoading,
  } = useAppSelector((state) => state.companyAdminDevelopers);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* ================= FETCH DEVELOPERS (ADD MODE ONLY) ================= */
  useEffect(() => {
    if (isOpen && mode === "ADD") {
      dispatch(fetchDevelopers({ page: 1, limit: 100 }));
    }
  }, [isOpen, mode, dispatch]);

  if (!selectedProject) return null;

  const { status, startDate, endDate, members } = selectedProject;

  /* ================= FILTER AVAILABLE DEVELOPERS ================= */
  const projectMemberIds = new Set(
    members.map((m) => m.user.id)
  );

  const availableDevelopers = developers.filter(
    (dev) => !projectMemberIds.has(dev.id)
  );

  /* ================= HANDLERS ================= */
  const handleRemove = (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    dispatch(removeMemberFromProject({ projectId, memberId }));
  };

const handleAddMembers = async () => {
  for (const userId of selectedIds) {
    await dispatch(
      addMembersToProject({
        projectId,
        userId,
      })
    );
  }

  setSelectedIds([]);
  onClose();
};



  /* ================= UI ================= */
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
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

        {/* Modal */}
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
            <Dialog.Panel className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
              {/* ================= HEADER ================= */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                <Dialog.Title className="text-lg font-semibold text-white">
                  {mode === "VIEW" ? "Project Members" : "Add Members"}
                </Dialog.Title>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ================= PROJECT SUMMARY ================= */}
              <div className="px-6 py-4 border-b border-slate-700 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400">Status</p>
                    <p className="text-white font-medium">
                      {status}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Start Date</p>
                    <p className="text-white font-medium">
                      {startDate ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">End Date</p>
                    <p className="text-white font-medium">
                      {endDate ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= BODY ================= */}
              <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                {/* ===== VIEW MODE ===== */}
                {mode === "VIEW" && (
                  <>
                    {members.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No members found.
                      </p>
                    )}

                    {members.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {member.user.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {member.user.email}
                          </p>
                          <span className="text-xs text-indigo-400">
                            {member.role}
                          </span>
                        </div>

                        {member.role !== "OWNER" && (
                          <button
                            disabled={loading}
                            onClick={() =>
                              handleRemove(member.user.id)
                            }
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* ===== ADD MODE ===== */}
                {mode === "ADD" && (
                  <>
                    {developersLoading && (
                      <p className="text-sm text-slate-400">
                        Loading developers...
                      </p>
                    )}

                    {!developersLoading &&
                      availableDevelopers.length === 0 && (
                        <p className="text-sm text-slate-400">
                          All developers are already part of this
                          project.
                        </p>
                      )}

                    {availableDevelopers.map((dev) => (
                      <label
                        key={dev.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(dev.id)}
                          onChange={() =>
                            setSelectedIds((prev) =>
                              prev.includes(dev.id)
                                ? prev.filter(
                                    (id) => id !== dev.id
                                  )
                                : [...prev, dev.id]
                            )
                          }
                        />
                        <div>
                          <p className="text-white">
                            {dev.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {dev.email}
                          </p>
                        </div>
                      </label>
                    ))}
                  </>
                )}
              </div>

              {/* ================= FOOTER ================= */}
              <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
                >
                  Cancel
                </button>

                {mode === "ADD" && (
                  <button
                    disabled={selectedIds.length === 0}
                    onClick={handleAddMembers}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    Add Members
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

