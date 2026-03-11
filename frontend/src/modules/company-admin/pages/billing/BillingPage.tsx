import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { fetchAvailablePlans, fetchCompanySubscription, fetchPaymentHistory } from "../../store/companyBilling.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";
import CurrentPlanCard from "../../components/billing/CurrentPlanCard";
import PlanCard from "../../components/billing/PlanCard";
import PaymentHistoryTable from "../../components/billing/PaymentHistoryTable";


const BillingPage = () => {
    const dispatch=useAppDispatch();
    const { subscription, plans, payments, loading }=useAppSelector(state=>state.companyBiiling)

    useEffect(()=>{
            dispatch(fetchCompanySubscription());
    dispatch(fetchAvailablePlans());
    dispatch(fetchPaymentHistory());
    },[dispatch])

      if (loading && !subscription) {
    return (
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
    );
  }
  return (
    <div className="p-6 space-y-8">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Billing
      </h1>

      {/* Current Plan */}
      {subscription && (
        <CurrentPlanCard subscription={subscription} />
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Payment History
        </h2>

        <PaymentHistoryTable payments={payments} />
      </div>

    </div>
  )
}

export default BillingPage
