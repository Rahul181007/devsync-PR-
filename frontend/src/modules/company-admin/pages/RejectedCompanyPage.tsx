import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircleIcon,
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { logout, reapplyCompany } from "../../auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";

const RejectedCompanyPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    rejectedCompany,
    rejectionReason,
    isAuthenticated,
    isAuthChecked,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    if (!isAuthenticated || !rejectedCompany) {
      navigate("/company/login", { replace: true });
    }
  }, [isAuthenticated, rejectedCompany, isAuthChecked, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/company/login", { replace: true });
  };

  const handleReapply = () => {
    dispatch(reapplyCompany());
  };

  if (!rejectedCompany) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
            <XCircleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Company Application Not Approved
          </h1>
          <p className="text-lg text-gray-600">
            Your registration request requires further review
          </p>
        </header>

        {/* Main Content Card */}
        <main className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Rejection Details */}
          <section className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="shrink-0">
                <div 
                  className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-xl"
                  aria-hidden="true"
                >
                  <XCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Administrator Feedback
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {rejectionReason || 
                    "No specific feedback was provided. Please review your submission and reapply."}
                </p>
              </div>
            </div>
          </section>

          {/* Action Section */}
          <section className="space-y-4 mb-8">
            <button
              onClick={handleReapply}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg 
                bg-blue-600 text-white font-medium hover:bg-blue-700 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Submit new application for approval"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Resubmit Application
            </button>
          </section>

          {/* Logout Section */}
          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center w-full px-4 py-3 
                text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 
                rounded-lg transition-colors duration-200 focus:outline-none 
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Sign out of company account"
            >
              <ArrowLeftOnRectangleIcon 
                className="h-5 w-5 mr-2 transition-colors duration-200" 
                aria-hidden="true"
              />
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RejectedCompanyPage;
