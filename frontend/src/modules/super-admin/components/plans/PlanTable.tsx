import { Table } from "../../../../shared/components/table"; 
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

const PlanTable = ({
  plans,
  loading,
  onEdit,
  search,
  status,
}: PlanTableProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.plans);

  const handleDelete = async (planId: string) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const result = await dispatch(
      deletePlan({ planId, page, limit, search, status })
    );

    if (deletePlan.fulfilled.match(result)) {
      toast.success("Plan deleted");
    }

    if (deletePlan.rejected.match(result)) {
      toast.error(result.payload as string || "Failed");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading plans...</div>;
  }

  const formatId = (id: string) => id.slice(0, 8) + "...";

  return (
    <Table<Plan>
      title="Plans"
      data={plans}
      emptyText="No plans found"
      getRowId={(plan) => plan.id}
      columns={[
        {
          header: "Plan",
          render: (plan) => (
            <div>
              <div className="font-semibold text-gray-900">
                {plan.name}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                ID: {formatId(plan.id)}
              </div>
              <div className="text-xs text-gray-400">
                {plan.description}
              </div>
            </div>
          ),
        },
        {
          header: "Monthly",
          render: (plan) => `${plan.currency} ${plan.pricePerMonth}`,
        },
        {
          header: "Yearly",
          render: (plan) => `${plan.currency} ${plan.pricePerYear}`,
        },
        {
          header: "Developers",
          render: (plan) =>
            plan.limits.maxDevelopers === -1
              ? "Unlimited"
              : plan.limits.maxDevelopers,
        },
        {
          header: "Projects",
          render: (plan) =>
            plan.limits.maxProjects === -1
              ? "Unlimited"
              : plan.limits.maxProjects,
        },
        {
          header: "Storage",
          render: (plan) =>
            plan.limits.maxStorageGB === -1
              ? "Unlimited"
              : `${plan.limits.maxStorageGB} GB`,
        },
        {
          header: "Status",
          render: (plan) =>
            plan.isActive ? (
              <span className="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                Inactive
              </span>
            ),
        },
        {
          header: "Actions",
          align: "right",
          render: (plan) => (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => onEdit(plan)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>

              {plan.isActive && (
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
};

export default PlanTable;