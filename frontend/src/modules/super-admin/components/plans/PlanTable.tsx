import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { deletePlan } from "../../store/plan.slice";
import type { Plan } from "../../typess/plan.types";

interface PlanTableProps {
    plans: Plan[];
    loading: boolean;
    onEdit: (plan: Plan) => void;
      search: string;
  status: "all" | "active" | "inactive";
}

const PlanTable = ({ plans, loading, onEdit,search,status }: PlanTableProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.plans);

  const handleDelete = async (planId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this plan?");
    if (!confirmDelete) return;

    const result = await dispatch(deletePlan({ planId, page, limit, search, status }));

    if (deletePlan.fulfilled.match(result)) {
      toast.success("Plan deleted successfully");
    }

    if (deletePlan.rejected.match(result)) {
      toast.error(result.payload as string || "Failed to delete plan");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading plans...
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No plans found
      </div>
    );
  }

  const formatId = (id: string) => {
    return id.slice(0, 8) + "...";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-left text-gray-600">
            <th className="px-6 py-4 font-medium">Plan</th>
            <th className="px-6 py-4 font-medium">Monthly</th>
            <th className="px-6 py-4 font-medium">Yearly</th>
            <th className="px-6 py-4 font-medium">Developers</th>
            <th className="px-6 py-4 font-medium">Projects</th>
            <th className="px-6 py-4 font-medium">Storage</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b border-gray-200 hover:bg-gray-50">
              {/* Plan Info */}
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">
                  {plan.name}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  ID: {formatId(plan.id)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {plan.description}
                </div>
              </td>

              {/* Monthly */}
              <td className="px-6 py-4 text-gray-900">
                {plan.currency} {plan.pricePerMonth}
              </td>

              {/* Yearly */}
              <td className="px-6 py-4 text-gray-900">
                {plan.currency} {plan.pricePerYear}
              </td>

              {/* Developers */}
              <td className="px-6 py-4 text-gray-900">
                {plan.limits.maxDevelopers === -1
                  ? "Unlimited"
                  : plan.limits.maxDevelopers}
              </td>

              {/* Projects */}
              <td className="px-6 py-4 text-gray-900">
                {plan.limits.maxProjects === -1
                  ? "Unlimited"
                  : plan.limits.maxProjects}
              </td>

              {/* Storage */}
              <td className="px-6 py-4 text-gray-900">
                {plan.limits.maxStorageGB === -1
                  ? "Unlimited"
                  : `${plan.limits.maxStorageGB} GB`}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {plan.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    INACTIVE
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right space-x-3">
                <button
                  onClick={() => onEdit(plan)}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                >
                  Edit
                </button>
                
                {/* Only show delete button for active plans (soft delete) */}
                {plan.isActive && (
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;