import { useEffect } from "react";
import { logout } from "../../auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import { ClockIcon, ArrowLeftOnRectangleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { waitingForApproval } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!waitingForApproval) {
      navigate("/company/dashboard", { replace: true });
    }
  }, [waitingForApproval, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/company/login", { replace: true });
  };

  if (!waitingForApproval) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-100 to-indigo-100 rounded-2xl mb-6">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Account Under Review
          </h1>
          <p className="text-lg text-gray-600">
            Your workspace is being reviewed by our team
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Status Card */}
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Awaiting Approval
                </h3>
                <p className="text-gray-700 mb-3">
                  Our security team is reviewing your company registration details. 
                  This process usually takes 24-48 hours during business days.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full">
                  <span className="text-sm font-medium text-yellow-800">
                    Status: Pending Super Admin Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              What happens next?
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <p className="ml-3 text-gray-700">
                  Our team verifies your company information and domain
                </p>
              </div>
              <div className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <p className="ml-3 text-gray-700">
                  You'll receive an email notification once approved
                </p>
              </div>
              <div className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <p className="ml-3 text-gray-700">
                  Full access to all platform features will be granted
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Need help or have questions?
            </p>
            <p className="text-sm text-gray-600">
              Contact our support team at{" "}
              <a 
                href="mailto:support@example.com" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                support@example.com
              </a>
            </p>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="font-medium">
                Logout and return later
              </span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              You can log back in anytime to check your approval status
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Business hours: Monday - Friday, 9 AM - 5 PM EST
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;