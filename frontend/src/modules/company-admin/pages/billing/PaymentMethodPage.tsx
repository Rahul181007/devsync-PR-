import { useLocation, useNavigate } from "react-router-dom";
import type { BillingCycle, Plan } from "../../types/billing.types";
import { useAppDispatch } from "../../../../store/hook";
import { createPayment, verifyPayment } from "../../store/companyBilling.slice";
import { ArrowLeft, CreditCard, Lock, Shield, CheckCircle, Clock, DollarSign, FileText, Zap, Building2, Calendar, Smartphone } from "lucide-react";
import { useState } from "react";

interface LocationState {
    plan: Plan;
    billingCycle: BillingCycle;
}

const PaymentMethodPage = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);

    const { plan, billingCycle } = location.state as LocationState
    const price =
        billingCycle === "MONTHLY"
            ? plan.pricePerMonth
            : plan.pricePerYear;

    const handleRazorpay = async () => {
        try {
            setIsProcessing(true);

            const result = await dispatch(
                createPayment({
                    planId: plan.id,
                    billingCycle
                })
            ).unwrap();

            const options: RazorpayOptions = {
                key: result.keyId,
                amount: result.razorpayAmount,
                currency: result.currency,
                order_id: result.orderId,
                name: "DevSync",
                description: `${plan.name} Plan - ${billingCycle}`,

                handler: async (response: RazorpayResponse) => {
                    try {
                        await dispatch(
                            verifyPayment({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            })
                        ).unwrap();

                        navigate("../billing/success");
                    } catch {
                        setIsProcessing(false);
                        navigate("../billing/failed", {
                            state: { plan, billingCycle }
                        });
                    }
                },

                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        navigate("../billing/failed", {
                            state: { plan, billingCycle }
                        });
                    }
                },

                theme: {
                    color: "#4f46e5" // Indigo color to match theme
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            navigate("../billing/failed", {
                state: { plan, billingCycle }
            });
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: plan.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Calculate tax (example: 18% GST)
    const taxRate = 0.18;
    const subtotal = price;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            
            {/* Back Navigation */}
            <button
                onClick={handleGoBack}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Invoice
            </button>

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Payment Checkout
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Lock className="w-3.5 h-3.5" />
                        Secure payment processing • SSL encrypted
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side - Invoice Details (2 columns) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Invoice Details Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 rounded-lg">
                                    <FileText className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-900">Invoice Summary</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Plan Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <Zap className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Selected Plan</p>
                                            <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Billing Cycle</p>
                                            <p className="mt-1">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    billingCycle === "MONTHLY" 
                                                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                                        : "bg-purple-50 text-purple-700 border border-purple-200"
                                                }`}>
                                                    <Clock className="w-3 h-3" />
                                                    {billingCycle}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <DollarSign className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total Amount</p>
                                            <p className="text-xl font-bold text-gray-900">{formatCurrency(price)}</p>
                                            <p className="text-xs text-gray-500 mt-1">Excluding taxes</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Building2 className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Billed To</p>
                                            <p className="text-sm font-medium text-gray-900">DevSync Inc.</p>
                                            <p className="text-xs text-gray-500">123 Business Ave, Suite 100</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Breakdown</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (18% GST)</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 my-2 pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900">Total Due</span>
                                            <span className="text-lg font-bold text-indigo-600">{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan Features Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="bg-linear-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-900">Plan Features</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-2 border border-gray-100">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-3 h-3" />
                                        </span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Payment Methods (1 column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden sticky top-6">
                        
                        {/* Card Header */}
                        <div className="bg-linear-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Razorpay Option */}
                                <button
                                    onClick={handleRazorpay}
                                    disabled={isProcessing}
                                    className="w-full group relative overflow-hidden bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-xl p-5 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
                                    
                                    <div className="relative flex items-center justify-between">
                                        <div className="text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CreditCard className="w-5 h-5" />
                                                <p className="font-semibold text-lg">Razorpay</p>
                                            </div>
                                            <p className="text-xs text-indigo-100">
                                                Pay via UPI, Cards, NetBanking, Wallet
                                            </p>
                                            
                                            {/* Payment icons */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">VISA</span>
                                                <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">Master</span>
                                                <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">UPI</span>
                                                <span className="bg-white/20 rounded px-1.5 py-0.5 text-[10px]">PayTM</span>
                                            </div>
                                        </div>
                                        
                                        {isProcessing ? (
                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                                <span className="text-xl">→</span>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* More payment methods can be added here */}
                                <div className="border border-gray-200 rounded-xl p-4 opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Smartphone className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-400">PayPal</p>
                                            <p className="text-xs text-gray-400">Coming soon</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span>SSL Secure Transaction</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Lock className="w-4 h-4 text-green-500" />
                                    <span>Your payment information is encrypted</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>256-bit SSL security</span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                <p className="text-xs text-indigo-700 text-center">
                                    <span className="font-semibold">🔒 Secure Checkout</span>
                                    <br />
                                    Your payment details are protected with industry-grade encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
                <p>By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.</p>
                <p className="mt-1">For any payment issues, contact support@devsync.com</p>
            </div>
        </div>
    );
};

export default PaymentMethodPage;