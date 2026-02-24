import { useState } from "react";
import { useAppDispatch } from "../../../../store/hook";
import { createSprint } from "../../store/sprint.slice";
import toast from "react-hot-toast";

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
    const [name, setName] = useState("");
    const [goal, setGoal] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Sprint name is required");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Start date and end date are required");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End date must be after start date");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await dispatch(
                createSprint({
                    projectId,
                    data: {
                        name,
                        goal: goal || null,
                        startDate,
                        endDate
                    }
                })
            );

            if (createSprint.fulfilled.match(result)) {
                toast.success("Sprint created successfully");
                // Reset form
                setName("");
                setGoal("");
                setStartDate("");
                setEndDate("");
                onClose();
            }

            if (createSprint.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = name.trim() && startDate && endDate;

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
                        <input
                            type="text"
                            placeholder="e.g., Sprint 1, Q1 Planning"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                        {!name.trim() && name.length > 0 && (
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
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
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
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date Preview */}
                    {startDate && endDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-700 flex items-center gap-2">
                                <span className="font-medium">Sprint duration:</span>
                                <span>
                                    {new Date(startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })} - {new Date(endDate).toLocaleDateString('en-US', {
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
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Sprint'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};