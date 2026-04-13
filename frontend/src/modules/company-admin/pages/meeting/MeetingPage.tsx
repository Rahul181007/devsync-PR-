import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { getMeetings } from "../../store/meeting.slice";
import MeetingList from "../../components/meetings/Meeting.List";
import CreateMeetingModal from "../../components/meetings/CreateMeetingModal";

interface Props {
    projectId: string;
}

const MeetingPage = ({ projectId }: Props) => {
    const dispatch = useAppDispatch();

    const { meetings, loading, error, total } = useAppSelector(
        (state) => state.companyMeeting
    );
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1);
    const limit = 3;
    const totalPages = Math.ceil(total / limit);
    useEffect(() => {
        if (!projectId) return;

        dispatch(getMeetings({ projectId, page, limit }));
    }, [dispatch, projectId, page]);

    return (
        <div className="h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Schedule, track, and manage all your project meetings
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Schedule Meeting
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
                        <h3 className="text-base font-medium text-gray-900 mb-1">No meetings scheduled</h3>
                        <p className="text-sm text-gray-500">Click "Schedule Meeting" to get started</p>
                    </div>
                )}

                {/* Meetings List */}
                {!loading && !error && meetings.length > 0 && (
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                        <MeetingList meetings={meetings} />
                    </div>
                )}

                {totalPages > 1 && (
  <div className="flex justify-between items-center mt-6">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Prev
    </button>

    <span className="text-sm text-gray-600">
      Page {page} of {totalPages}
    </span>

    <button
      disabled={page >= totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
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