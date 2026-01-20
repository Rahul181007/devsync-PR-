import { useEffect } from "react";
import { logout } from "../../auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const SuspendedCompanyPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    suspendedCompany,
    isAuthenticated,
    isAuthChecked,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    // safety guard
    if (!isAuthenticated || !suspendedCompany) {
      navigate("/company/login", { replace: true });
    }
  }, [isAuthenticated, suspendedCompany, isAuthChecked, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/company/login", { replace: true });
  };

  if (!suspendedCompany) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Company Suspended
          </h1>
          <p className="text-lg text-gray-600">
            Access to your workspace has been temporarily restricted
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Status Card */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-xl">
                  <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Suspended
                </h3>
                <p className="text-gray-700">
                  Your company account has been suspended by the platform
                  administrators. During this time, access to all company
                  features is disabled.
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8">
            <p className="text-sm font-medium text-gray-900 mb-2">
              What should you do?
            </p>
            <p className="text-sm text-gray-600">
              Please contact our support team if you believe this suspension
              was made in error or if you need further clarification.
            </p>
            <p className="mt-2 text-sm">
              📧{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                support@example.com
              </a>
            </p>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Business hours: Monday – Friday, 9 AM – 5 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuspendedCompanyPage;
