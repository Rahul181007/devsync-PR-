import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuildingOfficeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { clearCompanyError, createWorkspace } from "../../store/company.slice";
import { ROUTES } from "../../../../shared/constants/routes";
import OnboardingLayout from "../../components/OnboardingLayout";

const WorkspacePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.company);

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearCompanyError());
  }, [dispatch]);

  const handleSubmit = async () => {
    setLocalError(null);

    if (!name.trim()) {
      setLocalError("Workspace name is required");
      return;
    }

    const res = await dispatch(
      createWorkspace({
        name: name.trim(),
        domain: domain.trim() || undefined,
      })
    );

    if (createWorkspace.fulfilled.match(res)) {
      navigate(ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_BRANDING, {
        replace: true,
      });
    }
  };

  return (
    <OnboardingLayout 
      step={1} 
      title="Create your workspace"
      subtitle="Start by setting up your company workspace"
    >
      {(localError || error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm font-medium">
            {localError || error}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Acme Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This will be visible to all team members
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Domain
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="acme.com (optional)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Used for team email invitations
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Workspace...
            </span>
          ) : (
            "Create Workspace →"
          )}
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default WorkspacePage;

