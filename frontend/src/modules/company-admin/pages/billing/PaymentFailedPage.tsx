import { useLocation, useNavigate } from "react-router-dom";
import type { BillingCycle, Plan } from "../../types/billing.types";
import { XCircle, Mail, RefreshCw, ArrowLeft } from "lucide-react";

interface LocationState {
  plan: Plan;
  billingCycle: BillingCycle;
}

const PaymentFailedPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { plan, billingCycle } = (location.state || {}) as LocationState;

  const handleRetry = () => {
    navigate("../billing/payment-method", {
      state: { plan, billingCycle }
    });
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@devsync.com?subject=Payment%20Failed%20Issue";
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      
      {/* Main Card - Compact */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 text-center max-w-sm w-full">
        
        {/* Error Icon - Smaller */}
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Error Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Payment Failed
        </h2>
        
        <p className="text-xs text-gray-500 mb-4">
          Your payment could not be completed. Please try again.
        </p>

        {/* Transaction Details - Compact (only if available) */}
        {plan && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left border border-gray-200">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan:</span>
                <span className="font-medium text-gray-900">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Billing:</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  billingCycle === "MONTHLY" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "bg-purple-50 text-purple-700 border border-purple-200"
                }`}>
                  {billingCycle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {plan.currency} {billingCycle === "MONTHLY" ? plan.pricePerMonth : plan.pricePerYear}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips - Minimal */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
          <p className="text-[10px] text-amber-700">
            Check your card details and try again.
          </p>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleSupport}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Mail className="w-3 h-3" />
            Support
          </button>

          <button
            onClick={handleRetry}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        </div>

        {/* Back Link */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Billing
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;