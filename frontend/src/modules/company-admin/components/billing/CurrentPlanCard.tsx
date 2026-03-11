import type { Subscription } from "../../types/billing.types"
import { Calendar, CheckCircle, Cpu, HardDrive, Users } from "lucide-react"

interface Props{
    subscription:Subscription
}

const CurrentPlanCard = ({subscription}:Props) => {

    const price=subscription.billingCycle==="MONTHLY"?
    subscription.pricePerMonth:subscription.pricePerYear

    const renewDate=new Date(subscription.renewsAt).toLocaleDateString();
    
    // Helper function to format limit values
    const formatLimit = (value: number, unit: string = '') => {
        if (value === -1) return 'Unlimited';
        return unit ? `${value} ${unit}` : value.toString();
    };

    // Status badge styling based on status
    const getStatusBadge = (status: string) => {
        const statusStyles = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            expired: 'bg-amber-50 text-amber-700 border-amber-200',
            cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
            trial: 'bg-blue-50 text-blue-700 border-blue-200'
        };
        
        const defaultStyle = 'bg-gray-50 text-gray-700 border-gray-200';
        const style = statusStyles[status.toLowerCase() as keyof typeof statusStyles] || defaultStyle;
        
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header Row - Compact */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Current Plan
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Your active subscription
                        </p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium border border-indigo-100">
                        Active
                    </span>
                </div>
                
                {getStatusBadge(subscription.status)}
            </div>

            {/* Plan Info Row - Compact */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                    {subscription.planName}
                </h3>
                
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">
                        {subscription.currency} {price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs">
                        /{subscription.billingCycle.toLowerCase()}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">
                    <Calendar className="w-3 h-3" />
                    <span>Renews {renewDate}</span>
                </div>
            </div>

            {/* Features and Limits in a single row on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Features - Compact Grid */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {subscription.features.map((feature, index) => {
                            // Parse feature to display nicely
                            const featureLower = feature.toLowerCase();
                            let icon = <CheckCircle className="w-3 h-3" />;
                            let bgColor = "bg-emerald-50";
                            let textColor = "text-emerald-700";
                            
                            if (featureLower.includes('developer')) {
                                icon = <Users className="w-3 h-3" />;
                                bgColor = "bg-blue-50";
                                textColor = "text-blue-700";
                            } else if (featureLower.includes('project')) {
                                icon = <Cpu className="w-3 h-3" />;
                                bgColor = "bg-purple-50";
                                textColor = "text-purple-700";
                            } else if (featureLower.includes('storage')) {
                                icon = <HardDrive className="w-3 h-3" />;
                                bgColor = "bg-amber-50";
                                textColor = "text-amber-700";
                            }
                            
                            return (
                                <div
                                    key={index}
                                    className={`text-xs ${textColor} flex items-center gap-1.5 ${bgColor} rounded-md px-2 py-1.5`}
                                >
                                    <span className={`${bgColor} rounded-full`}>
                                        {icon}
                                    </span>
                                    <span className="font-medium capitalize">{feature}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Limits - Compact Cards */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                        Plan Limits
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <div className="flex items-center gap-1 mb-1">
                                <div className="p-1 bg-indigo-100 rounded-md">
                                    <Cpu className="w-3 h-3 text-indigo-600" />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">
                                    PROJECTS
                                </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                                {formatLimit(subscription.limits.maxProjects)}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <div className="flex items-center gap-1 mb-1">
                                <div className="p-1 bg-emerald-100 rounded-md">
                                    <Users className="w-3 h-3 text-emerald-600" />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">
                                    DEVS
                                </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                                {formatLimit(subscription.limits.maxDevelopers)}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <div className="flex items-center gap-1 mb-1">
                                <div className="p-1 bg-amber-100 rounded-md">
                                    <HardDrive className="w-3 h-3 text-amber-600" />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">
                                    STORAGE
                                </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                                {subscription.limits.maxStorageGB === -1 
                                    ? '∞' 
                                    : `${subscription.limits.maxStorageGB}GB`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentPlanCard