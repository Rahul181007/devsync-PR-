import { useParams } from "react-router-dom"
import type { Company } from "../typess/company.type";
import { useEffect, useState } from "react";
import { companyService } from "../services/company.service";
import CompanyInfoCard from "../components/CompanyInfoCard";
import CompanyAdminSection from "../components/CompanyAdminSection";
import { useAppDispatch } from "../../../store/hook";
import { suspendCompany } from "../store/companies.slice";

const CompanyDetailPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch=useAppDispatch();
  const fetchCompany = async () => {
    if (!companyId) return;

    try {
      const res = await companyService.getCompanyById(companyId);
      setCompany(res.data.data);
    } catch (error) {
      console.error("Failed to fetch company", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const handleSuspend = async () => {
    if (!companyId) return;

    const confirmSuspend = window.confirm(
      "Are you sure you want to suspend this company?"
    );

    if (!confirmSuspend) return;

    await dispatch(suspendCompany(companyId))
    await fetchCompany();
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CompanyInfoCard company={company} onSuspend={handleSuspend} />
        
        <div className="mt-6">
          <CompanyAdminSection
            company={company}
            onUpdated={fetchCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
