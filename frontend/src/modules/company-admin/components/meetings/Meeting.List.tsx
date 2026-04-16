// MeetingList.tsx
import type { Meeting } from "../../types/meeting.types";
import MeetingCard from "./MeetingCard";

interface Props {
    meetings: Meeting[];
}

const MeetingList = ({ meetings }: Props) => {
    if (meetings.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-md border border-gray-200">
                <p className="text-sm text-gray-500">No meetings to display</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
        </div>
    );
};

export default MeetingList;