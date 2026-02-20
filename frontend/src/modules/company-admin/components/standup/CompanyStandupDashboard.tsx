import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
    clearSelectedStandup,
    fetchCompanyStandupDetail,
    fetchCompanyStandupHistory,
    fetchCompanyTodayStandup,
} from "../../store/standup.slice";
import { StatusBadge } from "./StatusBadge";
import { SummaryCard } from "./SummaryCard";
import StandupViewModal from "./StandupViewModal";
import Spinner from "../../../../shared/components/LoadingSpinner";

/* ================= Types ================= */

type StandupMood =
    | "HAPPY"
    | "GOOD"
    | "NEUTRAL"
    | "STRESSED"
    | "BLOCKED";

/* ================= Mood Emoji Map ================= */

const moodEmojiMap: Record<StandupMood, string> = {
    HAPPY: "😄",
    GOOD: "🙂",
    NEUTRAL: "😐",
    STRESSED: "😓",
    BLOCKED: "🚫",
};

interface Props {
    projectId: string;
}

const CompanyStandupDashboard = ({ projectId }: Props) => {
    const dispatch = useAppDispatch();

    const { today, history, loading, error } = useAppSelector(
        (state) => state.companyStandup
    );

    const [isViewOpen, setIsViewOpen] = useState(false);

    /* ================= Handlers ================= */

    const handleView = (standupId: string) => {
        dispatch(fetchCompanyStandupDetail({ projectId, standupId }));
        setIsViewOpen(true);
    };

    /* ================= Fetch Data ================= */

    useEffect(() => {
        if (projectId) {
            dispatch(fetchCompanyTodayStandup(projectId));
            dispatch(fetchCompanyStandupHistory(projectId));
        }
    }, [dispatch, projectId]);

    /* ================= Loading / Error ================= */

    if (loading)
  return (
    <div className="p-6 flex justify-center">
      <Spinner size="lg" />
    </div>
  );
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    /* ================= UI ================= */

    return (
        <div className="grid grid-cols-3 gap-6 mt-6">
            {/* ================= LEFT SIDE - TODAY ================= */}
            <div className="col-span-2">
                {today && (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Today's Standup
                        </h2>

                        {/* ===== Summary Cards ===== */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <SummaryCard title="Total" value={today.totalMembers} />
                            <SummaryCard
                                title="Submitted"
                                value={today.submittedCount}
                                color="green"
                            />
                            <SummaryCard
                                title="Partial"
                                value={today.partialCount}
                                color="yellow"
                            />
                            <SummaryCard
                                title="Missed"
                                value={today.missedCount}
                                color="red"
                            />
                        </div>

                        {/* ===== Member List ===== */}
                        <div className="space-y-3">
                            {today.members.map((member) => (
                                <div
                                    key={member.userId}
                                    className="flex justify-between items-center border border-gray-100 hover:border-gray-200 transition rounded-xl p-4 bg-white"
                                >
                                    {/* ===== Left Section ===== */}
                                    <div className="flex items-center gap-3">
                                        <p className="font-medium text-gray-800">
                                            {member.name}
                                        </p>

                                        {member.mood && (
                                            <span className="text-xl">
                                                {
                                                    moodEmojiMap[
                                                    member.mood as StandupMood
                                                    ]
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* ===== Right Section ===== */}
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={member.status} />

                                        {member.standupId && (
                                            <button
                                                onClick={() => handleView(member.standupId!)}
                                                className="text-blue-600 text-sm hover:underline"
                                            >
                                                View
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ================= RIGHT SIDE - HISTORY ================= */}
            <div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Standup History
                    </h2>

                    <div className="space-y-4">
                        {history.map((sprint) => (
                            <div
                                key={sprint.sprintId}
                                className="border rounded-lg p-4"
                            >
                                <p className="font-medium">
                                    {sprint.sprintName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Completion: {sprint.completionPercentage}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= View Modal ================= */}
            <StandupViewModal
                isOpen={isViewOpen}
                onClose={() => {
                    dispatch(clearSelectedStandup());
                    setIsViewOpen(false);
                }}
            />
        </div>
    );
};

export default CompanyStandupDashboard;
