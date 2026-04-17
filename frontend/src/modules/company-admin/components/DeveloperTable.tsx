// DeveloperTable.tsx - Fully Responsive with Fixed Modal
import { useState } from "react";
import { useAppDispatch } from "../../../store/hook"
import { blockDeveloper, unblockDeveloper } from "../store/developer.slice";
import type { Developer } from "../types/developer.types";
import { Table } from "../../../shared/components/table";

interface DeveloperTableProps {
  developers: Developer[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10 border border-gray-200 mx-4">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-green-100'}`}>
                {isDestructive ? (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{message}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 shrink-0"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <p className="text-sm text-gray-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isDestructive ? 'bg-red-600 focus:ring-red-500' : 'bg-green-600 focus:ring-green-500'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeveloperTable = ({ developers }: DeveloperTableProps) => {
  const dispatch = useAppDispatch();
  const [developerToAction, setDeveloperToAction] = useState<{ id: string; action: 'block' | 'unblock'; name: string } | null>(null);

  const handleActionClick = (developer: Developer, action: 'block' | 'unblock') => {
    setDeveloperToAction({
      id: developer.id,
      action,
      name: developer.name || developer.email
    });
  };

  const handleConfirmAction = () => {
    if (developerToAction) {
      if (developerToAction.action === 'block') {
        dispatch(blockDeveloper(developerToAction.id));
      } else {
        dispatch(unblockDeveloper(developerToAction.id));
      }
      setDeveloperToAction(null);
    }
  };

  const handleCancelAction = () => {
    setDeveloperToAction(null);
  };

  if (developers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Developer List</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No developers found</h3>
          <p className="text-gray-500 max-w-sm text-sm">Invite developers to see them listed here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden w-full">


        {/* Horizontal scroll container for mobile */}
<Table
  title="Developer List"
  data={developers}
  emptyText="No developers found"
  columns={[
    {
      header: "Name",
      render: (dev) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {dev.name?.[0]?.toUpperCase() ||
                dev.email?.[0]?.toUpperCase() ||
                "?"}
            </span>
          </div>
          <div className="ml-3 text-sm font-medium text-gray-900">
            {dev.name || dev.email.split("@")[0]}
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      render: (dev) => (
        <div className="text-sm text-gray-900 truncate max-w-[200px]">
          {dev.email}
        </div>
      ),
    },
    {
      header: "Status",
      render: (dev) => <StatusBadge status={dev.status} />,
    },
    {
      header: "Actions",
      render: (dev) => (
        <>
          {dev.status === "ACTIVE" ? (
            <button
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
              onClick={() => handleActionClick(dev, "block")}
            >
              Block
            </button>
          ) : (
            <button
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-green-600 hover:bg-green-700"
              onClick={() => handleActionClick(dev, "unblock")}
            >
              Unblock
            </button>
          )}
        </>
      ),
    },
  ]}
/>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={developerToAction?.action === 'block'}
        title="Block Developer"
        message={`Are you sure you want to block ${developerToAction?.name}? They will no longer be able to access the platform.`}
        confirmText="Yes, Block"
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={developerToAction?.action === 'unblock'}
        title="Unblock Developer"
        message={`Are you sure you want to unblock ${developerToAction?.name}? They will regain access to the platform.`}
        confirmText="Yes, Unblock"
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isDestructive={false}
      />
    </>
  );
};

/* ---------- Helper UI ---------- */
const StatusBadge = ({ status }: { status: string }) => {
  const base = "inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium";

  const styles = status === "ACTIVE"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <span className={`${base} ${styles}`}>
      {status === "ACTIVE" ? (
        <svg className="w-2 h-2 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-2 h-2 sm:w-3 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )}
      {status}
    </span>
  );
};