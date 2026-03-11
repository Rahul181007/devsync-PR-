import { useLocation, useNavigate } from "react-router-dom";
import type { BillingCycle, Plan } from "../../types/billing.types"
import { useState } from "react";
import { Calendar, CreditCard, Download, FileText, Clock, CheckCircle, DollarSign, Building2, Hash, Receipt, ArrowLeft } from "lucide-react";

interface LocationState{
    plan:Plan;
    billingCycle:BillingCycle
}

const InvoicePage = () => {
    const location=useLocation();
    const navigate=useNavigate();

    const {plan,billingCycle}=location.state as LocationState
    const [invoiceId] = useState(() => `INV-${Date.now().toString().slice(-8)}`);

  const price =
    billingCycle === "MONTHLY"
      ? plan.pricePerMonth
      : plan.pricePerYear;

  const handlePayNow = () => {
    navigate("../billing/payment-method", {
      state: { plan, billingCycle }
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Calculate tax (example: 18% GST)
  const taxRate = 0.18;
  const subtotal = price;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: plan.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      
      {/* Back Navigation */}
      <button
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Billing
      </button>

      {/* Header with Invoice Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice {invoiceId}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5" />
              Generated on {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 shadow-sm hover:shadow group">
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          Download PDF
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side - 2 columns */}
        <div className="lg:col-span-2 space-y-6">

          {/* Invoice Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Invoice Information</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Hash className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Invoice ID</p>
                      <p className="text-sm font-medium text-gray-900">{invoiceId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company Name</p>
                      <p className="text-sm font-medium text-gray-900">DevSync</p>
                      <p className="text-xs text-gray-500 mt-1">123 Business Ave, Suite 100</p>
                      <p className="text-xs text-gray-500">San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Issue Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Billing Cycle</p>
                      <p className="text-sm font-medium text-gray-900">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          billingCycle === "MONTHLY" 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}>
                          {billingCycle}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billed Items Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Billed Items</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{plan.name} Subscription</span>
                          <span className="text-xs text-gray-500 mt-1">{billingCycle} billing • Includes all features</span>
                        </div>
                      </td>
                      <td className="py-4">1</td>
                      <td className="py-4 font-medium">{formatCurrency(price)}</td>
                      <td className="py-4 font-medium">{formatCurrency(price)}</td>
                    </tr>
                    
                    {/* Additional fees or discounts can go here */}
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden sticky top-6">
            
            {/* Card Header */}
            <div className="bg-linear-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Payment Summary</h2>
              </div>
            </div>

            {/* Summary Details */}
            <div className="p-6">
              <div className="space-y-4">
                
                {/* Plan Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 bg-indigo-100 rounded">
                      <FileText className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{plan.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(price)}</span>
                  </div>
                </div>

                {/* Billing Cycle */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Billing Cycle
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    billingCycle === "MONTHLY" 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}>
                    {billingCycle}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax (18% GST)</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(tax)}</span>
                </div>

                {/* Total Due */}
                <div className="bg-linear-to-r from-indigo-50 to-transparent p-4 rounded-lg -mx-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Due</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-indigo-600">{formatCurrency(total)}</span>
                      <p className="text-xs text-gray-500 mt-1">Includes all taxes</p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayNow}
                  className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>

                {/* Secure Payment Note */}
                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Secure payment powered by DevSync
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
        <p>This is a computer-generated invoice. No signature is required.</p>
        <p className="mt-1">For any queries, contact support@devsync.com</p>
      </div>
    </div>
  );
};

export default InvoicePage;