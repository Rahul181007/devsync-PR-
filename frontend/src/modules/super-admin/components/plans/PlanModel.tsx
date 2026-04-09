import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createPlan, updatePlan } from "../../store/plan.slice";
import type { Plan } from "../../typess/plan.types";
import type { PlanFormValues } from "./PlanForm";
import PlanForm from "./PlanForm";
import { useState } from "react";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
}

const PlanModal = ({ isOpen, onClose, plan }: PlanModalProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.plans);

  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isEditMode = Boolean(plan);

  if (!isOpen) return null;

  const handleSubmit = async (data: PlanFormValues) => {
    setLoading(true);

    try {
      if (isEditMode && plan) {

        const transformedData: Parameters<typeof updatePlan>[0]["data"] = {
          ...data,
          features: data.features?.map((f) => f.value)
        };
        const result = await dispatch(
          updatePlan({
            planId: plan.id,
            data: transformedData,
            page,
            limit
          })
        );

        if (updatePlan.fulfilled.match(result)) {
          toast.success(plan.isActive ? "Plan updated successfully" : "Plan reactivated successfully");
          onClose();
        }

        if (updatePlan.rejected.match(result)) {
          setFormErrors({ general: result.payload as string });
        }

      } else {
        const transformedData = {
          ...data,
          features: data.features
            .map(f => f.value)
            .filter(f => f && f.trim() !== "")
        };

        const result = await dispatch(
          createPlan({
            data: transformedData,
            page,
            limit
          })
        );

        if (createPlan.fulfilled.match(result)) {
          toast.success("Plan created successfully");
          onClose();
        }

        if (createPlan.rejected.match(result)) {
          setFormErrors({ general: result.payload as string });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Edit Plan" : "Create New Plan"}
            </h2>
            {isEditMode && plan && (
              <p className="text-sm text-gray-500 mt-1">
                {plan.isActive ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Active Plan - Make changes below
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-500"></span>
                    Inactive Plan - Reactivate by updating and saving
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <PlanForm
            defaultValues={plan ?? undefined}
            onSubmit={handleSubmit}
            loading={loading}
            onClose={onClose}
            backendErrors={formErrors}
          />
        </div>

      </div>
    </div>
  );
};

export default PlanModal;
