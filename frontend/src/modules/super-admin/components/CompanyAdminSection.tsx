import { useState, useEffect } from "react";
import type { Company } from "../typess/company.type";
import { companyService } from "../services/company.service";
import { userService } from "../services/user.service";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface Props {
  company: Company;
  onUpdated: () => void;
}

const CompanyAdminSection = ({ company, onUpdated }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);

  useEffect(() => {
    setEmail(company.adminEmail ?? '');
  }, [company.adminEmail]);

  const isCompanySuspended = company.status === "SUSPENDED";

  const handleInvite = async () => {
    try {
      setLoading(true);
      setError(null);
      await companyService.inviteCompanyAdmin(company.id, email);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!company.admin) return;
    
    try {
      setLoading(true);
      setError(null);
      await userService.blockCompanyAdmin(company.admin.id);
      setShowBlockConfirm(false);
      onUpdated();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!company.admin) return;

    try {
      setLoading(true);
      setError(null);
      await userService.unblockCompanyAdmin(company.admin.id);
      setShowUnblockConfirm(false);
      onUpdated();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getAdminStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "BLOCKED":
        return "bg-red-100 text-red-800 border-red-200";
      case "INVITED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      {/* Block Confirmation Modal */}
      {showBlockConfirm && company.admin && (
        <div className="fixed inset-0 z-50">
          {/* Modal container positioned over main content */}
          <div className="absolute left-64 right-0 top-16 bottom-0 flex items-center justify-center p-6">
            {/* Transparent backdrop with ONLY blur effect - NO background color */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              onClick={() => !loading && setShowBlockConfirm(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10 border border-gray-200">
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Block Company Admin</h3>
                    <p className="text-sm text-gray-500 mt-1">This action will restrict admin access</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">
                    Are you sure you want to block <span className="font-semibold text-gray-900">{company.admin.email}</span>?
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    They will immediately lose access to the platform and won't be able to perform any administrative actions.
                  </p>
                  
                  {/* Warning Box */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-red-700 font-medium">Important</p>
                        <p className="text-sm text-red-600 mt-1">
                          This action cannot be undone. The admin will need to be unblocked manually to regain access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBlockConfirm(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBlock}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Blocking..." : "Block Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Confirmation Modal */}
      {showUnblockConfirm && company.admin && (
        <div className="fixed inset-0 z-50">
          {/* Modal container positioned over main content */}
          <div className="absolute left-64 right-0 top-16 bottom-0 flex items-center justify-center p-6">
            {/* Transparent backdrop with ONLY blur effect - NO background color */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              onClick={() => !loading && setShowUnblockConfirm(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10 border border-gray-200">
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Unblock Company Admin</h3>
                    <p className="text-sm text-gray-500 mt-1">Restore admin access</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">
                    Are you sure you want to unblock <span className="font-semibold text-gray-900">{company.admin.email}</span>?
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    They will regain immediate access to the platform with full administrative privileges.
                  </p>
                  
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Note</p>
                        <p className="text-sm text-blue-600 mt-1">
                          The admin will be able to log in and manage their company immediately after unblocking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUnblockConfirm(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnblock}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Unblocking..." : "Unblock Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Company Admin</h2>
              <p className="text-gray-600 text-sm">Manage company administrator</p>
            </div>
          </div>

          {isCompanySuspended ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium">Company is Suspended</p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Admin management features are disabled while the company is suspended.
                    {company.admin && (
                      <span className="block mt-1">
                        Current admin: <span className="font-medium">{company.admin.email}</span> ({company.admin.status})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : !company.admin ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Company Admin
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter admin email address"
                    value={email}
                    disabled={!!company.adminEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 px-4 py-2.5 border rounded-lg ${company.adminEmail
                      ? "bg-gray-100 cursor-not-allowed"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                      }`}
                  />

                  <button
                    onClick={handleInvite}
                    disabled={loading || !email}
                  >
                    {loading
                      ? "Sending..."
                      : company.hasPendingInvite
                        ? "Re-Send Invite"
                        : "Send Invite"}

                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  An invitation email will be sent to this address.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">✓ Invite sent successfully!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Admin Email
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-700 font-medium">{company.admin.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Admin Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getAdminStatusColor(company.admin.status)}`}>
                      {company.admin.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {company.admin.status === "ACTIVE" && (
                  <button
                    onClick={() => setShowBlockConfirm(true)}
                    disabled={loading}
                    className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Block Admin
                  </button>
                )}

                {company.admin.status === "BLOCKED" && (
                  <button
                    onClick={() => setShowUnblockConfirm(true)}
                    disabled={loading}
                    className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Unblock Admin
                  </button>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyAdminSection;
