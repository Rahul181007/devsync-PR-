import { useState } from "react";
import { useAppDispatch } from "../../../../store/hook";
import { createMeeting } from "../../store/meeting.slice";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string
}

const CreateMeetingModal = ({ isOpen, onClose, projectId }: Props) => {
    const dispatch = useAppDispatch();

    const [form, setForm] = useState({
        title: "",
        description: "",
        scheduledAt: "",
        durationMinutes: 30,
        meetingLink: "",
        meetingType: "GOOGLE_MEET" as const,
    })
    if(!isOpen)return null;

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async () => {
    await dispatch(
      createMeeting({
        projectId,
        data: {
          ...form,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
        },
      })
    );

    onClose();
  };
return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">Schedule Meeting</h2>

        <input
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="scheduledAt"
          type="datetime-local"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="meetingLink"
          placeholder="Meeting Link"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingModal;