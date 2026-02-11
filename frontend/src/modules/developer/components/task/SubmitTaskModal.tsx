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

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!summary.trim() || !workDone.trim()) {
      alert("Summary and work done are required");
      return;
    }

    onSubmit({
      summary,
      workDone,
      blockers: blockers.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Submit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div>
          <label className="text-sm text-gray-500">Summary *</label>
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Short summary"
          />
        </div>

        {/* Work Done */}
        <div>
          <label className="text-sm text-gray-500">Work Done *</label>
          <textarea
            value={workDone}
            onChange={(e) => setWorkDone(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            rows={4}
            placeholder="Explain what you did"
          />
        </div>

        {/* Blockers */}
        <div>
          <label className="text-sm text-gray-500">Blockers (optional)</label>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            rows={2}
            placeholder="Any blockers?"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Submit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitTaskModal;
