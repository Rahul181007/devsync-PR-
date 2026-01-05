import { useParams } from "react-router-dom"
import type { Company } from "../typess/company.type";
import { useCallback, useEffect, useState } from "react";
import { companyService } from "../services/company.service";
import CompanyInfoCard from "../components/CompanyInfoCard";
import CompanyAdminSection from "../components/CompanyAdminSection";
import { useAppDispatch } from "../../../store/hook";
import { suspendCompany } from "../store/companies.slice";
import { clearAuthError } from "../../auth/auth.slice";

const CompanyDetailPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [suspendLoading, setSuspendLoading] = useState(false);
  const dispatch = useAppDispatch();
  
const fetchCompany = useCallback(async () => {
  if (!companyId) return;

  try {
    const res = await companyService.getCompanyById(companyId);
    setCompany(res.data.data);
  } catch (error) {
    console.error("Failed to fetch company", error);
  } finally {
    setLoading(false);
  }
}, [companyId]);


useEffect(() => {
  dispatch(clearAuthError());
}, [dispatch]);



  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleSuspend = async () => {
    if (!companyId) return;

    try {
      setSuspendLoading(true);
      await dispatch(suspendCompany(companyId));
      setShowSuspendConfirm(false);
      await fetchCompany();
    } catch (error) {
      console.error("Failed to suspend company", error);
    } finally {
      setSuspendLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🏢</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Company Not Found</h1>
        <p className="text-gray-600">The requested company could not be found.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Suspend Company Confirmation Modal */}
      {showSuspendConfirm && company && (
        <div className="fixed inset-0 z-50">
          {/* Modal container positioned over main content */}
          <div className="absolute left-64 right-0 top-16 bottom-0 flex items-center justify-center p-6">
            {/* Transparent backdrop with ONLY blur effect - NO background color */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              onClick={() => !suspendLoading && setShowSuspendConfirm(false)}
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
                    <h3 className="text-lg font-semibold text-gray-900">Suspend Company</h3>
                    <p className="text-sm text-gray-500 mt-1">This action will suspend all company operations</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">
                    Are you sure you want to suspend <span className="font-semibold text-gray-900">{company.name}</span>?
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    This will immediately suspend the company's account. All company users, including admins, will lose access to the platform.
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
                          This is a serious action. All company operations will be halted until the suspension is lifted.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Details */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 mb-1">Company Details:</p>
                      <p className="text-gray-600">• Company: {company.name}</p>
                      <p className="text-gray-600">• Domain: {company.domain || "Not specified"}</p>
                      {company.admin && (
                        <p className="text-gray-600">• Admin: {company.admin.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSuspendConfirm(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    disabled={suspendLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSuspend}
                    disabled={suspendLoading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suspendLoading ? "Suspending..." : "Suspend Company"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <CompanyInfoCard 
            company={company} 
            onSuspend={() => setShowSuspendConfirm(true)} 
          />
          
          <div className="mt-6">
            <CompanyAdminSection
              company={company}
              onUpdated={fetchCompany}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailPage;
