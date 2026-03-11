import { useState } from "react";
import type { BillingCycle, Plan } from "../../types/billing.types"
import { useNavigate } from "react-router-dom";
import { CheckCircle, Cpu, HardDrive, Users, Zap } from "lucide-react";

interface Props {
    plan:Plan
}
const PlanCard = ({plan}:Props) => {
const navigate=useNavigate();
const [billingCycle,setBillingCycle]=useState<BillingCycle>("MONTHLY")
const price=billingCycle==="MONTHLY"?plan.pricePerMonth:plan.pricePerYear

const handleUpgrade=()=>{
    navigate("../billing/invoice",{
        state:{
            plan,
            billingCycle
        }
    })
}

// Helper function to format limit values
const formatLimit = (value: number, unit: string = '') => {
    if (value === -1) return 'Unlimited';
    return unit ? `${value} ${unit}` : value.toString();
};

// Get gradient based on plan name/type
const getPlanGradient = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('pro')) {
        return 'from-indigo-500 to-purple-600';
    } else if (name.includes('business')) {
        return 'from-blue-500 to-indigo-600';
    } else if (name.includes('enterprise')) {
        return 'from-purple-500 to-pink-600';
    } else {
        return 'from-gray-600 to-gray-800';
    }
};

// Get badge color based on plan
const getPlanBadge = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('pro')) {
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (name.includes('business')) {
        return 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (name.includes('enterprise')) {
        return 'bg-purple-50 text-purple-700 border-purple-200';
    } else {
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

// Calculate savings for yearly billing
const yearlySavings = billingCycle === "YEARLY" && plan.pricePerYear && plan.pricePerMonth ? 
    Math.round((1 - (plan.pricePerYear / (plan.pricePerMonth * 12))) * 100) : 0;

 return (
    <div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Popular Tag - Compact */}
      {plan.name.toLowerCase().includes('pro') && (
        <div className="absolute top-0 right-0 bg-linear-to-l from-amber-400 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg z-10 flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5" /> POPULAR
        </div>
      )}

      {/* Header with gradient - Compact */}
      <div className={`bg-linear-to-r ${getPlanGradient(plan.name)} px-4 py-2.5`}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {plan.name}
          </h3>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getPlanBadge(plan.name)} bg-white/90 backdrop-blur-sm`}>
            {plan.name.split(' ')[0] || 'Plan'}
          </span>
        </div>
        <p className="text-xs text-white/90 mt-0.5 line-clamp-1">
          {plan.description}
        </p>
      </div>

      {/* Billing Cycle Toggle - Compact */}
      <div className="px-4 pt-3">
        <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg mb-2">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
              billingCycle === "MONTHLY"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("YEARLY")}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 relative ${
              billingCycle === "YEARLY"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
            {yearlySavings > 0 && billingCycle === "YEARLY" && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                -{yearlySavings}%
              </span>
            )}
          </button>
        </div>

        {/* Price Display - Compact */}
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-xl font-bold text-gray-900">
            {plan.currency} {price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs">
            /{billingCycle.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Features Section - Compact */}
      <div className="px-4 flex-1">
        <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          What's included
        </h4>
        <ul className="space-y-1.5 mb-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-xs text-gray-700 flex items-start gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-2.5 h-2.5" />
              </span>
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Limits Section - Compact Cards */}
      <div className="px-4 mb-3">
        <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-indigo-500" />
          Plan limits
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-gray-50 rounded-lg p-1.5 text-center group-hover:bg-indigo-50/50 transition-colors duration-200">
            <div className="flex justify-center mb-0.5">
              <div className="p-1 bg-indigo-100 rounded-full">
                <Cpu className="w-2.5 h-2.5 text-indigo-600" />
              </div>
            </div>
            <p className="text-[9px] font-medium text-gray-500">Projects</p>
            <p className="text-xs font-bold text-gray-900">
              {formatLimit(plan.limits.maxProjects)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-1.5 text-center group-hover:bg-emerald-50/50 transition-colors duration-200">
            <div className="flex justify-center mb-0.5">
              <div className="p-1 bg-emerald-100 rounded-full">
                <Users className="w-2.5 h-2.5 text-emerald-600" />
              </div>
            </div>
            <p className="text-[9px] font-medium text-gray-500">Developers</p>
            <p className="text-xs font-bold text-gray-900">
              {formatLimit(plan.limits.maxDevelopers)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-1.5 text-center group-hover:bg-amber-50/50 transition-colors duration-200">
            <div className="flex justify-center mb-0.5">
              <div className="p-1 bg-amber-100 rounded-full">
                <HardDrive className="w-2.5 h-2.5 text-amber-600" />
              </div>
            </div>
            <p className="text-[9px] font-medium text-gray-500">Storage</p>
            <p className="text-xs font-bold text-gray-900">
              {plan.limits.maxStorageGB === -1 ? '∞' : `${plan.limits.maxStorageGB}GB`}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Button - Compact */}
      <div className="px-4 pb-4">
        <button
          onClick={handleUpgrade}
          className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 text-white text-xs font-medium py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5"
        >
          Upgrade to {plan.name}
        </button>
      </div>

    </div>
  );
};

export default PlanCard;