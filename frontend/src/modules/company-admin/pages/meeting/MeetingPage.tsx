
import { useEffect, useState, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { getCompletedMeetings, getMeetings, getMissedMeetings, getTodayMeetings } from "../../store/meeting.slice";
import MeetingList from "../../components/meetings/Meeting.List";
import CreateMeetingModal from "../../components/meetings/CreateMeetingModal";
import { getProjectSprints } from "../../store/sprint.slice";

interface Props {
    projectId: string;
}
type FilterType = "ALL" | "STANDUP" | "SPRINT" | "GENERAL";

const MeetingPage = ({ projectId }: Props) => {
    const dispatch = useAppDispatch();

    const { sprints } = useAppSelector((state) => state.companyAdminSprint);
    const { meetings, todayMeetings, missedMeetings,completedMeetings, loading, error, total } = useAppSelector(
        (state) => state.companyMeeting
    );



    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState<FilterType>("ALL");
    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>();
    const [isSprintDropdownOpen, setIsSprintDropdownOpen] = useState(false);
    const limit = 3;
    const totalPages = Math.ceil(total / limit);

    const now = new Date();
    const todayMeetingsList = todayMeetings.filter((m) => new Date(m.scheduledAt) > now);

    useEffect(() => {
        if (!projectId) return;
        dispatch(getMeetings({
            projectId,
            page,
            limit,
            sprintId: selectedSprintId,
            type: filterType !== "ALL" ? filterType : undefined
        }));
    }, [dispatch, projectId, page, selectedSprintId, filterType]);

    useEffect(() => {
        if (!projectId) return;
        dispatch(getProjectSprints(projectId));
    }, [dispatch, projectId]);

    useEffect(() => {
        if (!projectId) return;
        dispatch(getTodayMeetings({ projectId }));
    }, [dispatch, projectId]);

    useEffect(() => {
        if (!projectId) return;
        dispatch(getMissedMeetings({ projectId }));
    }, [dispatch, projectId]);

    useEffect(() => {
    if (!projectId) return;

    dispatch(getCompletedMeetings({ projectId }));
}, [dispatch, projectId]);

    const filteredMeetings = meetings;

    console.log("COMPLETED:", meetings.filter(m => m.status === "COMPLETED"));

    const filterOptions: { value: FilterType; label: string; icon: JSX.Element }[] = [
        { value: "ALL", label: "All Meetings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> },
        { value: "STANDUP", label: "Daily Standup", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /></svg> },
        { value: "SPRINT", label: "Sprint Meetings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
        { value: "GENERAL", label: "General", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Jira-style Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Meetings</h1>
                                <p className="text-xs text-gray-500 mt-0.5">Schedule and track project meetings</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create meeting
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Loading meetings...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && meetings.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No meetings yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Get started by creating your first meeting</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create meeting
                        </button>
                    </div>
                )}

                {/* Filters Section - Jira Style */}
                {!loading && !error && (
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            {/* Meeting Type Filter */}
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value as FilterType);
                                        setPage(1);
                                    }}
                                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                >
                                    {filterOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Sprint Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSprintDropdownOpen(!isSprintDropdownOpen)}
                                    className="inline-flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                                >
                                    <span>Sprint: {selectedSprintId ? sprints.find(s => s.id === selectedSprintId)?.name || 'All' : 'All'}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isSprintDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isSprintDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsSprintDropdownOpen(false)} />
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSprintId(undefined);
                                                        setIsSprintDropdownOpen(false);
                                                        setPage(1);
                                                    }}
                                                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${!selectedSprintId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                                >
                                                    All Sprints
                                                </button>
                                                {sprints.map((sprint) => (
                                                    <button
                                                        key={sprint.id}
                                                        onClick={() => {
                                                            setSelectedSprintId(sprint.id);
                                                            setIsSprintDropdownOpen(false);
                                                            setPage(1);
                                                        }}
                                                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors ${selectedSprintId === sprint.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                                    >
                                                        {sprint.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Today's Meetings Section */}
                {!loading && !error && todayMeetingsList.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Today's Meetings</h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {todayMeetingsList.length}
                            </span>
                        </div>
                        <MeetingList meetings={todayMeetingsList} />
                    </div>
                )}

                {/* Missed Meetings Section */}
                {!loading && !error && missedMeetings.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Missed Meetings</h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {missedMeetings.length}
                            </span>
                        </div>
                        <MeetingList meetings={missedMeetings} />
                    </div>
                )}

                {/* Completed Meetings Section */}
                {!loading && !error && completedMeetings.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Completed Meetings
                            </h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {completedMeetings.length}
                            </span>
                        </div>

                        <MeetingList meetings={completedMeetings} />
                    </div>
                )}

                {/* All Meetings Section */}
                {!loading && !error && meetings.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">All Meetings</h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {filteredMeetings.length}
                            </span>
                        </div>
                        <MeetingList
                            meetings={filteredMeetings.filter(
                                (m) =>
                                    !todayMeetings.some((t) => t.id === m.id) &&
                                    !missedMeetings.some((mm) => mm.id === m.id) &&
                                    m.status !== "COMPLETED" // ✅ ADD THIS
                            )}
                        />
                    </div>
                )}

                {/* Pagination - Jira Style */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                if (pageNum > 0 && pageNum <= totalPages) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`
                                                w-8 h-8 rounded-md text-sm font-medium transition-colors
                                                ${page === pageNum
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <CreateMeetingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={projectId}
            />
        </div>
    );
};

export default MeetingPage;