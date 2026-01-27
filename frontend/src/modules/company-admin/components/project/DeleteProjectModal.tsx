interface DeleteProjectModalProps {
    open:boolean;
    projectName:string;
    loading?:boolean;
    onClose:()=>void;
    onConfirm:()=>void;
}

const DeleteProjectModal=({
    open,
    projectName,
    loading,
    onClose,
    onConfirm,
}:DeleteProjectModalProps)=>{
    if(!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Project
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{projectName}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;