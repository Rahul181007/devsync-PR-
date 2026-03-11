import { useForm, useFieldArray } from "react-hook-form";
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
  features: { value: string }[];
  limits: {
    maxProjects: number;
    maxDevelopers: number;
    maxStorageGB: number;
  };
}

const PlanForm = ({ defaultValues, onSubmit, loading, onClose }: PlanFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<PlanFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      pricePerMonth: defaultValues?.pricePerMonth ?? 0,
      pricePerYear: defaultValues?.pricePerYear ?? 0,
      currency: defaultValues?.currency ?? "USD",
      features:
        defaultValues?.features?.map((f) => ({ value: f })) ?? [{ value: "" }],
      limits: {
        maxProjects: defaultValues?.limits?.maxProjects ,
        maxDevelopers: defaultValues?.limits?.maxDevelopers ,
        maxStorageGB: defaultValues?.limits?.maxStorageGB
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features"
  });

  const isInactive = defaultValues && !defaultValues.isActive;

  const handleFormSubmit = (data: PlanFormValues) => {
    const payload = {
      ...data,
      features: data.features.map((f) => f.value)
    };
    onSubmit(payload as unknown as PlanFormValues);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

      {isInactive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Reactivating this plan
              </h4>
              <p className="text-xs text-yellow-700 mt-1">
                This plan is currently inactive. Saving changes will reactivate it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plan Name
        </label>
        <input
          {...register("name", { required: "Plan name is required" })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
        />
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Price
          </label>
          <input
            type="number"
            {...register("pricePerMonth", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yearly Price
          </label>
          <input
            type="number"
            {...register("pricePerYear", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

      </div>

      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
        <select
          {...register("currency")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
        >
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      {/* Features */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Plan Features</h3>

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">

            <input
              {...register(`features.${index}.value`)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter feature"
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>

          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="text-blue-600 text-sm mt-2"
        >
          + Add Feature
        </button>
      </div>

      {/* Limits */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Plan Limits</h3>

        <div className="grid grid-cols-3 gap-4">

          <input
            type="number"
            {...register("limits.maxProjects", { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Max Projects"
          />

          <input
            type="number"
            {...register("limits.maxDevelopers", { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Max Developers"
          />

          <input
            type="number"
            {...register("limits.maxStorageGB", { valueAsNumber: true })}
            className="border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Max Storage"
          />

        </div>

        <p className="text-xs text-gray-400 mt-2">Use -1 for unlimited</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm text-gray-700 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm text-white bg-blue-600 rounded-lg"
        >
          {loading ? "Saving..." : "Save Plan"}
        </button>

      </div>

    </form>
  );
};

export default PlanForm;