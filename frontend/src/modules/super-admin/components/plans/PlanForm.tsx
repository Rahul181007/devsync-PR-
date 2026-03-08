import { useForm } from "react-hook-form";
import type { Plan } from "../../typess/plan.types";

interface PlanFormProps {
    defaultValues?: Partial<Plan>;
    onSubmit: (data: PlanFormValues) => void;
    loading?: boolean;
    onClose: () => void;
    
}

export interface PlanFormValues {
    name: string;
    description: string;
    pricePerMonth: number;
    pricePerYear: number;
    currency: "USD" | "INR" | "EUR";
    features: string[];
    limits: {
        maxProjects: number;
        maxDevelopers: number;
        maxStorageGB: number;
    }
}

const PlanForm = ({ defaultValues, onSubmit, loading ,onClose}: PlanFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlanFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      pricePerMonth: defaultValues?.pricePerMonth ?? 0,
      pricePerYear: defaultValues?.pricePerYear ?? 0,
      currency: defaultValues?.currency ?? "USD",
      features: defaultValues?.features ?? [],
      limits: {
        maxProjects: defaultValues?.limits?.maxProjects ?? 0,
        maxDevelopers: defaultValues?.limits?.maxDevelopers ?? 0,
        maxStorageGB: defaultValues?.limits?.maxStorageGB ?? 0
      }
    }
  });

  const isInactive = defaultValues && !defaultValues.isActive;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Reactivation Notice */}
      {isInactive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Reactivating this plan</h4>
              <p className="text-xs text-yellow-700 mt-1">
                This plan is currently inactive. Saving changes will reactivate it and make it available for selection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: "Plan name is required" })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="e.g., Pro Plan"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Describe what this plan offers..."
        />
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              {...register("pricePerMonth", { 
                valueAsNumber: true,
                required: "Monthly price is required",
                min: { value: 0, message: "Price cannot be negative" }
              })}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>
          {errors.pricePerMonth && (
            <p className="mt-1 text-xs text-red-500">{errors.pricePerMonth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yearly Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              {...register("pricePerYear", { 
                valueAsNumber: true,
                required: "Yearly price is required",
                min: { value: 0, message: "Price cannot be negative" }
              })}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>
          {errors.pricePerYear && (
            <p className="mt-1 text-xs text-red-500">{errors.pricePerYear.message}</p>
          )}
        </div>
      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency <span className="text-red-500">*</span>
        </label>
        <select
          {...register("currency", { required: "Currency is required" })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
        >
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      {/* Limits Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Plan Limits</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Projects
            </label>
            <input
              type="number"
              {...register("limits.maxProjects", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Developers
            </label>
            <input
              type="number"
              {...register("limits.maxDevelopers", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="5"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Storage (GB)
            </label>
            <input
              type="number"
              {...register("limits.maxStorageGB", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="100"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Use -1 for unlimited</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {isInactive ? "Reactivating..." : "Saving..."}
            </>
          ) : (
            isInactive ? "Reactivate Plan" : "Save Plan"
          )}
        </button>
      </div>
    </form>
  );
};

export default PlanForm;