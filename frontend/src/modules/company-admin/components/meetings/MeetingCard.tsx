import type { Meeting } from "../../types/meeting.types";
import { useAppDispatch } from "../../../../store/hook";
import { updateMeeting } from "../../store/meeting.slice";
import { useState } from "react";

interface Props {
    meeting: Meeting;
}

const MeetingCard = ({ meeting }: Props) => {
    const dispatch = useAppDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState(meeting.notes || "");
    const [decisions, setDecisions] = useState(meeting.decisions || "");
    const [meetingLink, setMeetingLink] = useState(meeting.meetingLink || "");

const handleSave = () => {
     console.log("sending link:", meetingLink);
  dispatch(
    updateMeeting({
      projectId: meeting.projectId,
      meetingId: meeting.id,
      data: {
        notes,
        decisions,
        meetingLink,  
      },
    })
  );
};

    const handleComplete = () => {
        dispatch(
            updateMeeting({
                projectId: meeting.projectId,
                meetingId: meeting.id,
                data: { status: "COMPLETED" },
            })
        );
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        dispatch(
            updateMeeting({
                projectId: meeting.projectId,
                meetingId: meeting.id,
                data: { status: "CANCELLED" },
            })
        );
        setIsModalOpen(false);
    };

    const openModal = () => {
        setNotes(meeting.notes || "");
        setDecisions(meeting.decisions || "");
        setMeetingLink(meeting.meetingLink || "");
        setIsModalOpen(true);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", label: "Completed" };
            case "CANCELLED":
                return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Cancelled" };
            default:
                return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", label: "Scheduled" };
        }
    };

    const statusConfig = getStatusConfig(meeting.status);
    const isEditable = meeting.status !== "CANCELLED";

    return (
        <>
            {/* Card */}
            <div
                onClick={openModal}
                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            {/* Title & Status */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-medium text-gray-900">
                                    {meeting.title}
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                    {statusConfig.label}
                                </span>
                            </div>

                            {/* Date & Link */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(meeting.scheduledAt).toLocaleString()}</span>
                                </div>
                                {meeting.meetingLink && meeting.status === "SCHEDULED" && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <a
                                            href={meeting.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m1.172-7.656l-1.102 1.102m4-4a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.102" />
                                            </svg>
                                            Join Meeting
                                        </a>
                                    </>
                                )}
                            </div>

                            {/* Preview */}
                            {(meeting.notes || meeting.decisions) && (
                                <div className="text-xs text-gray-400 truncate">
                                    {meeting.notes && <span>📝 {meeting.notes.substring(0, 50)}</span>}
                                    {meeting.notes && meeting.decisions && <span> · </span>}
                                    {meeting.decisions && <span>✅ {meeting.decisions.substring(0, 50)}</span>}
                                </div>
                            )}
                        </div>

                        {/* Arrow */}
                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />

                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{meeting.title}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                            {statusConfig.label}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(meeting.scheduledAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Meeting Notes
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        disabled={!isEditable}
                                        rows={3}
                                        placeholder="Add notes about key discussion points..."
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Key Decisions
                                    </label>
                                    <textarea
                                        value={decisions}
                                        onChange={(e) => setDecisions(e.target.value)}
                                        disabled={!isEditable}
                                        rows={3}
                                        placeholder="Add decisions made during the meeting..."
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meeting Link
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Paste Google Meet / Zoom link"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        disabled={!isEditable}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm"
                                    />
                                </div>

                                {meeting.meetingLink && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <a
                                            href={meeting.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m1.172-7.656l-1.102 1.102m4-4a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.102" />
                                            </svg>
                                            {meeting.meetingLink}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-2 p-5 border-t bg-gray-50 rounded-b-xl">
                                <button onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Close
                                </button>

                                {meeting.status === "SCHEDULED" && (
                                    <>
                                        <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                            Save
                                        </button>
                                        <button onClick={handleComplete} className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                            Complete
                                        </button>
                                        <button onClick={handleCancel} className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg">
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {meeting.status === "COMPLETED" && (
                                    <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                        Update
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MeetingCard;