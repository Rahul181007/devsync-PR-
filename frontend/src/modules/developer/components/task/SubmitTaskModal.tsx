import { useState } from "react";

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    summary: string;
    workDone: string;
    blockers?: string;
  }) => void;
}

const SubmitTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}: SubmitTaskModalProps) => {
  const [summary, setSummary] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [blockers, setBlockers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!summary.trim() || !workDone.trim()) {
      alert("Summary and work done are required");
      return;
    }

    setIsSubmitting(true);
    
    onSubmit({
      summary,
      workDone,
      blockers: blockers.trim() || undefined,
    });

    // Reset form
    setSummary("");
    setWorkDone("");
    setBlockers("");
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = summary.trim() && workDone.trim();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Submit Task</h2>
              <p className="text-sm text-gray-500 mt-1">
                Mark your task as ready for review
              </p>
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
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Summary */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Summary
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-auto">Brief overview</span>
            </label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="e.g., Implemented user authentication, fixed navigation bug..."
              autoFocus
            />
            {!summary.trim() && summary.length > 0 && (
              <p className="text-xs text-red-500 mt-1">Summary is required</p>
            )}
          </div>

          {/* Work Done */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Work Done
              <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 ml-auto">Detailed description</span>
            </label>
            <textarea
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="Explain what you accomplished, including key changes, features, or fixes..."
            />
            {!workDone.trim() && workDone.length > 0 && (
              <p className="text-xs text-red-500 mt-1">Work done description is required</p>
            )}
          </div>

          {/* Blockers */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Blockers
              <span className="text-xs text-gray-400 ml-auto">Optional</span>
            </label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              rows={2}
              placeholder="Any challenges or blockers you encountered? (optional)"
            />
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">💡</span>
              <div>
                <p className="text-xs font-medium text-blue-700">Tips for a good submission:</p>
                <ul className="text-xs text-blue-600 mt-1 space-y-1">
                  <li>• Be specific about what you accomplished</li>
                  <li>• Mention any challenges you overcame</li>
                  <li>• Link to relevant PRs or documentation if applicable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
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
                Submitting...
              </>
            ) : (
              'Submit Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitTaskModal;
