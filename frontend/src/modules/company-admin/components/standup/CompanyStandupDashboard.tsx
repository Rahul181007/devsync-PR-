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
            <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                <Spinner size="lg" />
            </div>
        );

    if (error)
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-red-500">{error}</p>
            </div>
        );

    /* ================= UI ================= */

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* ================= LEFT SIDE - TODAY ================= */}
            <div className="lg:col-span-2">
                {today ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Today's Standup
                            </h2>
                        </div>

                        <div className="p-6">
                            {/* ===== Summary Cards ===== */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                                        className="flex justify-between items-center border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all rounded-xl p-4 bg-white"
                                    >
                                        {/* ===== Left Section ===== */}
                                        <div className="flex items-center gap-3">
                                            {/* Avatar with initials */}
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-800">
                                                        {member.name}
                                                    </p>
                                                    {member.mood && (
                                                        <span className="text-xl">
                                                            {moodEmojiMap[member.mood as StandupMood]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ===== Right Section ===== */}
                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={member.status} />

                                            {member.standupId && (
                                                <button
                                                    onClick={() => handleView(member.standupId!)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No standup for today</h3>
                        <p className="text-gray-500">Standup data will appear here when team members submit their updates</p>
                    </div>
                )}
            </div>

            {/* ================= RIGHT SIDE - HISTORY ================= */}
            <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
                    <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Standup History
                        </h2>
                    </div>

                    <div className="p-4 max-h-[500px] overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-gray-500">No history available</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((sprint) => (
                                    <div
                                        key={sprint.sprintId}
                                        className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all"
                                    >
                                        <p className="font-medium text-gray-900 mb-2">
                                            {sprint.sprintName}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Completion</span>
                                                <span className={`font-medium ${
                                                    sprint.completionPercentage >= 75 ? "text-green-600" :
                                                    sprint.completionPercentage >= 50 ? "text-yellow-600" :
                                                    "text-red-600"
                                                }`}>
                                                    {sprint.completionPercentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-1.5 rounded-full ${
                                                        sprint.completionPercentage >= 75 ? "bg-green-500" :
                                                        sprint.completionPercentage >= 50 ? "bg-yellow-500" :
                                                        "bg-red-500"
                                                    }`}
                                                    style={{ width: `${sprint.completionPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
