import type { ProjectMember } from "../../types/project.types";

interface ProjectMembersProps {
  members?: ProjectMember[]; // 👈 optional
  maxVisible?: number;
}

const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const DevProjectMembers = ({
  members = [], 
  maxVisible = 4,
}: ProjectMembersProps) => {
  const visible = members.slice(0, maxVisible);
  const remaining = members.length - visible.length;

  if (members.length === 0) {
    return (
      <span className="text-sm text-gray-400 mt-1 inline-block">
        No members
      </span>
    );
  }

  return (
    <div className="flex items-center -space-x-2 mt-1">
      {visible.map((member) => (
        <div
          key={member.user.id}
          title={member.user.name}
          className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
        >
          {getInitials(member.user.name)}
        </div>
      ))}

      {remaining > 0 && (
        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default DevProjectMembers;