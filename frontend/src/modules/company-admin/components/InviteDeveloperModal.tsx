// InviteDeveloperModal.tsx - Updated
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { clearDeveloperError, fetchDevelopers, inviteDeveloper } from "../store/developer.slice";

interface InviteDeveloperModalProps {
  open: boolean;
  onClose: () => void;
}

export const InviteDeveloperModal = ({
  open,
  onClose
}: InviteDeveloperModalProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.companyAdminDevelopers);

  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(inviteDeveloper({ email }));

    if (inviteDeveloper.fulfilled.match(result)) {
      setEmail("");
      dispatch(clearDeveloperError());
      dispatch(fetchDevelopers({ page: 1, limit: 10 }));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Modal container positioned over main content */}
      <div className="absolute left-64 right-0 top-16 bottom-0 flex items-center justify-center p-6">
        {/* Transparent backdrop with ONLY blur effect - NO background color */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={() => !loading && onClose()}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10 border border-gray-200">
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Invite Developer</h3>
                  <p className="text-sm text-gray-500 mt-1">Send an invitation to join your development team</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={loading}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-4">
            <div className="space-y-4">
              {/* Developer Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error && !email.trim() ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={loading}
                />
                {error && !email.trim() && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  An invitation email will be sent to this address
                </p>
              </div>

              {/* General Error */}
              {error && email.trim() && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Inviting..." : "Invite Developer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};