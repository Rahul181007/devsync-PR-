interface DeleteProjectModalProps {
    open: boolean;
    projectName: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteProjectModal = ({
    open,
    projectName,
    loading,
    onClose,
    onConfirm,
}: DeleteProjectModalProps) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop with blur effect */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                {/* Header with warning icon */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <svg 
                                className="w-6 h-6 text-red-600" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Delete Project
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                This action is permanent and cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 border-t border-b border-gray-100">
                    <p className="text-gray-700">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                            {projectName}
                        </span>
                        ?
                    </p>
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex gap-2">
                            <svg 
                                className="w-5 h-5 text-amber-600 shrink-0" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <p className="text-sm text-amber-800">
                                This will permanently delete all project data, including tasks, files, and team associations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer with actions */}
                <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg 
                                    className="animate-spin h-4 w-4 text-white" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                    />
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                    />
                                </svg>
                                <span>Delete Project</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;