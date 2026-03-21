
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateWorklog } from "../../store/worklog.slice";
import toast from "react-hot-toast";
import type { WorklogItem } from "../../types/worklog.types";
import { useState,useMemo } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  taskId: string;
  worklog: WorklogItem;
  estimatedTime?: number | null;
}

export const EditWorklogModal = ({
  isOpen,
  onClose,
  projectId,
  taskId,
  worklog,
  estimatedTime,
}: Props) => {
  const dispatch = useAppDispatch();
  const { worklogs } = useAppSelector((state) => state.devWorklog);

const [timeSpent, setTimeSpent] = useState<string>(
  () => (worklog.timeSpent / 60).toString()
);

const [description, setDescription] = useState(
  () => worklog.description || ""
);

  const totalLogged = useMemo(() => {
    return worklogs
      .filter((l) => l.id !== worklog.id)
      .reduce((sum, log) => sum + log.timeSpent, 0);
  }, [worklogs, worklog.id]);

  const remaining =
    estimatedTime != null ? estimatedTime - totalLogged : null;

  const toHours = (min: number) => (min / 60).toFixed(1);

  const handleUpdate = async () => {
    if (!timeSpent || Number(timeSpent) <= 0) {
      return toast.error("Enter valid time");
    }

    const result = await dispatch(
      updateWorklog({
        projectId,
        taskId,
        worklogId: worklog.id,
        data: {
          timeSpent: Number(timeSpent) * 60,
          description,
        },
      })
    );

    if (updateWorklog.fulfilled.match(result)) {
      toast.success("Worklog updated");
      onClose();
    }

    if (updateWorklog.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-base font-semibold">Edit Worklog</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded text-center">
              <p className="text-xs">Logged</p>
              <p className="font-bold">{toHours(totalLogged)}h</p>
            </div>

            {estimatedTime != null && (
              <>
                <div className="bg-purple-50 p-3 rounded text-center">
                  <p className="text-xs">Estimated</p>
                  <p className="font-bold">{toHours(estimatedTime)}h</p>
                </div>

                <div className="bg-green-50 p-3 rounded text-center">
                  <p className="text-xs">Remaining</p>
                  <p className="font-bold">
                    {remaining != null ? toHours(remaining) : "-"}h
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="text-xs">Time (hours)</label>
            <input
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};