import { useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, ArrowLeft, Home } from "lucide-react";
import { useState } from "react";

const PaymentSuccessPage = () => {

  const navigate = useNavigate();
  

  const [transactionId] = useState(() => `#DEV${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [currentDate] = useState(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  });

  const handleBilling = () => {
    navigate("../billing");
  };

  const handleDashboard = () => {
    navigate("../dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      
      {/* Main Card - Compact */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 text-center max-w-sm w-full">
        
        {/* Success Icon - Smaller */}
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Success Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Payment Successful!
        </h2>
        
        <p className="text-xs text-gray-500 mb-4">
          Your subscription has been activated successfully.
        </p>

        {/* Success Details - Compact */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[10px] font-medium text-green-700 uppercase tracking-wider">Transaction Summary</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px] font-medium">
                <CheckCircle className="w-2.5 h-2.5" />
                Completed
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs text-gray-900">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900">{currentDate}</span>
            </div>
          </div>
        </div>

        {/* What's Next - Minimal */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
          <p className="text-[10px] text-blue-700">
            Your plan is now active. Start using all features immediately.
          </p>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleBilling}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-3 h-3" />
            Billing
          </button>

          <button
            onClick={handleDashboard}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors"
          >
            <Home className="w-3 h-3" />
            Dashboard
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

        {/* Confirmation Note */}
        <p className="mt-3 text-[9px] text-gray-400 border-t border-gray-100 pt-2">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;