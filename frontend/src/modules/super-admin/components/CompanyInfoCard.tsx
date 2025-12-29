import type { Company } from "../typess/company.type";

interface Props {
  company: Company;
  onSuspend: () => void;
}

const CompanyInfoCard = ({ company, onSuspend }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(company.status)}`}>
                {company.status}
              </span>
            </div>
            <p className="text-gray-600">Company Details</p>
          </div>
          
          {company.status === "APPROVED" && (
            <button
              onClick={onSuspend}
              className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Suspend Company
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Domain
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium">{company.domain ?? "-"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(company.status)}`}>
                {company.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Owner Admin ID
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono">
              {company.ownerAdminId ? (
                <span className="text-gray-700 font-medium text-sm">{company.ownerAdminId}</span>
              ) : (
                <span className="text-gray-400 italic">Not assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
