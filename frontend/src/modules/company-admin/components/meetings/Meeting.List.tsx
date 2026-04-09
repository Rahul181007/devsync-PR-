import type { Meeting } from "../../types/meeting.types";
import MeetingCard from "./MeetingCard";

interface Props{
    meetings:Meeting[]
}

const MeetingList = ({ meetings }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
};

export default MeetingList;