import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createWorklog } from "../../store/worklog.slice";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  taskId: string;
  estimatedTime?: number | null; // in minutes
}

export const CreateWorklogModal = ({
  isOpen,
  onClose,
  projectId,
  taskId,
  estimatedTime,
}: Props) => {
  const dispatch = useAppDispatch();

  const { worklogs } = useAppSelector((state) => state.devWorklog);

  const [timeSpent, setTimeSpent] = useState<string>("");
  const [description, setDescription] = useState("");


  const totalLogged = useMemo(() => {
    return worklogs.reduce((sum, log) => sum + log.timeSpent, 0);
  }, [worklogs]);


  const remaining =
    estimatedTime != null ? estimatedTime - totalLogged : null;

  // Convert minutes → hours
  const toHours = (min: number) => (min / 60).toFixed(1);

  const handleSubmit = async () => {
    if (!timeSpent || Number(timeSpent) <= 0) {
      return toast.error("Enter valid time");
    }

    const result = await dispatch(
      createWorklog({
        projectId,
        taskId,
        data: {
          timeSpent: Number(timeSpent) * 60, // convert hours → minutes
          description,
        },
      })
    );

    if (createWorklog.fulfilled.match(result)) {
      toast.success("Worklog added");
      onClose();
      setTimeSpent("");
      setDescription("");
    }

    if (createWorklog.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="text-base font-semibold text-gray-900">Log Work</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* 🔥 Time Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 text-center border border-blue-200/50">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Logged</p>
              <p className="text-xl font-bold text-blue-700">{toHours(totalLogged)}h</p>
            </div>

            {estimatedTime != null && (
              <>
                <div className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 text-center border border-purple-200/50">
                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-1">Estimated</p>
                  <p className="text-xl font-bold text-purple-700">{toHours(estimatedTime)}h</p>
                </div>

                <div className={`bg-linear-to-br rounded-lg p-3 text-center border ${
                  remaining != null && remaining < 0
                    ? "from-red-50 to-red-100/50 border-red-200/50"
                    : "from-green-50 to-green-100/50 border-green-200/50"
                }`}>
                  <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                    remaining != null && remaining < 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    Remaining
                  </p>
                  <p className={`text-xl font-bold ${
                    remaining != null && remaining < 0 ? "text-red-700" : "text-green-700"
                  }`}>
                    {remaining != null ? toHours(remaining) : "-"}h
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Time Input */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Time Spent
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                hours
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              You can enter decimals (e.g., 2.5 for 2 hours 30 minutes)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Work Description
            </label>
            <textarea
              placeholder="What did you work on? Be specific..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Optional but recommended for better tracking
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save Worklog
          </button>
        </div>
      </div>
    </div>
  );
};