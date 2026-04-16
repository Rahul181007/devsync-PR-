
import { useAppDispatch } from "../../../../store/hook";
import { createSprint } from "../../store/sprint.slice";
import toast from "react-hot-toast";
import InputField from "../../../../shared/components/InputField";
import { createSprintSchema } from "../../validator/sprint.validator";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const CreateSprintModal = ({
    isOpen,
    onClose,
    projectId
}: Props) => {
    const dispatch = useAppDispatch();

   



    const formHook = useFormValidation(
        {
            name: "",
            goal: "",
            startDate: "",
            endDate: "",
        },
        createSprintSchema,
        async (vals) => {
            const result = await dispatch(
                createSprint({
                    projectId,
                    data: {
                        name: vals.name,
                        goal: vals.goal || null,
                        startDate: vals.startDate,
                        endDate: vals.endDate,
                    },
                })
            );

            if (createSprint.fulfilled.match(result)) {
                toast.success("Sprint created successfully");
                onClose(); 
            }

            if (createSprint.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        }
    );

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        reset
    } = formHook;

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

  


   

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Create New Sprint</h2>
                            <p className="text-sm text-gray-500 mt-1">Plan your next development cycle</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors text-xl font-medium"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-5">
                    {/* Sprint Name Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            Sprint Name
                            <span className="text-red-500">*</span>
                        </label>
                        <InputField
                            value={values.name}
                            onChange={(val) => handleChange("name", val)}
                            onBlur={() => handleBlur("name")}
                            error={touched.name ? errors.name : ""}
                            placeholder="e.g., Sprint 1, Q1 Planning"

                        />
                        {!values.name.trim() && values.name.length > 0 && (
                            <p className="text-xs text-red-500 mt-1">Sprint name is required</p>
                        )}
                    </div>

                    {/* Sprint Goal Field */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Sprint Goal
                            <span className="text-xs text-gray-400 ml-2">(optional)</span>
                        </label>
                        <textarea
                            placeholder="What is the main objective of this sprint?"
                            value={values.goal}
                            onChange={(e) => handleChange("goal", e.target.value)}
                            onBlur={() => handleBlur("goal")}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Date Fields Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                Start Date
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <InputField
                                    type="date"
                                    value={values.startDate}
                                    onChange={(val) => handleChange("startDate", val)}
                                    onBlur={() => handleBlur("startDate")}
                                    error={touched.startDate ? errors.startDate : ""}
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                End Date
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <InputField
                                    type="date"
                                    value={values.endDate}
                                    onChange={(val) => handleChange("endDate", val)}
                                    onBlur={() => handleBlur("endDate")}
                                    error={touched.endDate ? errors.endDate : ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date Preview */}
                    {values.startDate && values.endDate && !errors.endDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-700 flex items-center gap-2">
                                <span className="font-medium">Sprint duration:</span>
                                <span>
                                    {new Date(values.startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })} - {new Date(values.endDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Form Footer with Actions */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
<button
  onClick={handleSubmit}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow flex items-center gap-2"
>
  Create Sprint
</button>
                </div>
            </div>
        </div>
    );
};