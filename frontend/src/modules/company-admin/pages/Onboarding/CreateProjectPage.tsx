import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useState } from "react";
import { createFirstProject } from "../../store/project.slice";
import { ROUTES } from "../../../../shared/constants/routes";
import OnboardingLayout from "../../components/OnboardingLayout";
import { CalendarDaysIcon, DocumentTextIcon, HashtagIcon } from "@heroicons/react/24/outline";

const CreateProjectPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const res = await dispatch(
      createFirstProject({
        name,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    );

    if (createFirstProject.fulfilled.match(res)) {
      navigate(ROUTES.COMPANY_ADMIN.COMPANY_PENDING_APPROVAL, {
        replace: true,
      });
    }
  };

  return (
    <OnboardingLayout 
      step={3} 
      title="Create your first project"
      subtitle="Kickstart your journey with your first project"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HashtagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe your project goals and objectives..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Optional. Add details about project scope, goals, or requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Almost there! Complete setup to access your dashboard
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Project...
              </span>
            ) : (
              "Finish Setup →"
            )}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default CreateProjectPage;
