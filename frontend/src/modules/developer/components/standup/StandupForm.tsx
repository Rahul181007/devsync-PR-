import { useEffect } from "react";
import type { DeveloperStandup, StandupMood } from "../../types/standup.type";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { createDeveloperStandup, updateDeveloperStandup } from "../../store/standup.slice";
import toast from "react-hot-toast";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";
import { standupSchema } from "../../validator/standup.validator";


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

  const formHook = useFormValidation(
    {
      yesterday: todayStandup?.yesterday ?? "",
      today: todayStandup?.today ?? "",
      blockers: todayStandup?.blockers ?? "",
      mood: todayStandup?.mood ?? "GOOD",
    },
    standupSchema,
    async (vals) => {
      const payload = {
        yesterday: vals.yesterday,
        today: vals.today,
        blockers: vals.blockers || null,
        mood: vals.mood,
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

  useEffect(() => {
  if (todayStandup) {
    formHook.setValues({
      yesterday: todayStandup.yesterday ?? "",
      today: todayStandup.today ?? "",
      blockers: todayStandup.blockers ?? "",
      mood: todayStandup.mood ?? "GOOD",
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [todayStandup]);

 


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {todayStandup ? "Update Standup" : "Submit Standup"}
        </h2>

        <textarea
          placeholder="Yesterday..."
          value={values.yesterday}
          onChange={(e) => handleChange("yesterday", e.target.value)}
          onBlur={() => handleBlur("yesterday")}
          className="w-full border rounded-lg p-2"
          rows={3}
        />
        {touched.yesterday && errors.yesterday && (
          <p className="text-xs text-red-500">{errors.yesterday}</p>
        )}

        <textarea
          placeholder="Today..."
          value={values.today}
          onChange={(e) => handleChange("today", e.target.value)}
          onBlur={() => handleBlur("today")}
          className="w-full border rounded-lg p-2"
          rows={3}
        />
        {touched.today && errors.today && (
          <p className="text-xs text-red-500">{errors.today}</p>
        )}

        <textarea
          placeholder="Blockers..."
          value={values.blockers ?? ""}
          onChange={(e) => handleChange("blockers", e.target.value)}
          onBlur={() => handleBlur("blockers")}
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
                onClick={() => handleChange("mood", option.value)}
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200
          ${values.mood === option.value
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
            onClick={handleClose}
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
