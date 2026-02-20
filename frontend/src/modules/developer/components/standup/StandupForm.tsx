import {  useState } from "react";
import type { DeveloperStandup, StandupMood } from "../../types/standup.type";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createDeveloperStandup, updateDeveloperStandup } from "../../store/standup.slice";
import toast from "react-hot-toast";


interface Props {
  projectId: string;
  todayStandup: DeveloperStandup | null;
  onClose: () => void;
}

const moodOptions: {
  value: StandupMood;
  emoji: string;
  label: string;
}[] = [
  { value: "HAPPY", emoji: "😄", label: "Happy" },
  { value: "GOOD", emoji: "🙂", label: "Good" },
  { value: "NEUTRAL", emoji: "😐", label: "Neutral" },
  { value: "STRESSED", emoji: "😓", label: "Stressed" },
  { value: "BLOCKED", emoji: "🚫", label: "Blocked" },
];


const StandupModal = ({ projectId, todayStandup, onClose }: Props) => {
  const dispatch = useAppDispatch();
const { loading } = useAppSelector(
  (state) => state.devStandup
);

const [yesterday, setYesterday] = useState(
  todayStandup?.yesterday ?? ""
);

const [today, setToday] = useState(
  todayStandup?.today ?? ""
);

const [blockers, setBlockers] = useState<string | null>(
  todayStandup?.blockers ?? null
);

const [mood, setMood] = useState<StandupMood>(
  todayStandup?.mood ?? "GOOD"
);




const handleSubmit = async () => {
  const payload = {
    yesterday,
    today,
    blockers: blockers || null,
    mood,
  };

  let result;

  if (todayStandup) {
    result = await dispatch(
      updateDeveloperStandup({ projectId, data: payload })
    );

    if (updateDeveloperStandup.fulfilled.match(result)) {
      toast.success("Standup updated successfully");
      onClose();
    }

    if (updateDeveloperStandup.rejected.match(result)) {
      toast.error(result.payload as string);
    }

  } else {
    result = await dispatch(
      createDeveloperStandup({ projectId, data: payload })
    );

    if (createDeveloperStandup.fulfilled.match(result)) {
      toast.success("Standup submitted successfully");
      onClose();
    }

    if (createDeveloperStandup.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  }
};



  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {todayStandup ? "Update Standup" : "Submit Standup"}
        </h2>

        <textarea
          placeholder="Yesterday..."
          value={yesterday}
          onChange={(e) => setYesterday(e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={3}
        />

        <textarea
          placeholder="Today..."
          value={today}
          onChange={(e) => setToday(e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={3}
        />

        <textarea
          placeholder="Blockers..."
          value={blockers ?? ""}
          onChange={(e) => setBlockers(e.target.value || null)}
          className="w-full border rounded-lg p-2"
          rows={2}
        />

        <div>
  <p className="text-sm text-gray-500 mb-2">Mood</p>

  <div className="flex gap-3">
    {moodOptions.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => setMood(option.value)}
        className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200
          ${
            mood === option.value
              ? "border-blue-600 bg-blue-50 scale-105 shadow-sm"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        <span className="text-2xl">{option.emoji}</span>
        <span className="text-xs mt-1 text-gray-600">
          {option.label}
        </span>
      </button>
    ))}
  </div>
</div>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandupModal;
