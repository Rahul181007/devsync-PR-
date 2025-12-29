import { useState } from "react";
import type { Company } from "../typess/company.type";
import { companyService } from "../services/company.service";
import { userService } from "../services/user.service";

interface Props {
  company: Company;
  onUpdated: () => void;
}

const CompanyAdminSection = ({ company, onUpdated }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isCompanySuspended = company.status === "SUSPENDED";

  const handleInvite = async () => {
    try {
      setLoading(true);
      setError(null);
      await companyService.inviteCompanyAdmin(company.id, email);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to send invite. Please try again.');
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
      onUpdated();
    } catch {
      setError("Failed to block company admin");
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
      onUpdated();
    } catch {
      setError("Failed to unblock company admin");
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleInvite}
                  disabled={loading || !email}
                  className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Invite"
                  )}
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
                  onClick={handleBlock}
                  disabled={loading}
                  className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {loading ? "Processing..." : "Block Admin"}
                </button>
              )}

              {company.admin.status === "BLOCKED" && (
                <button
                  onClick={handleUnblock}
                  disabled={loading}
                  className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? "Processing..." : "Unblock Admin"}
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
  );
};

export default CompanyAdminSection;
