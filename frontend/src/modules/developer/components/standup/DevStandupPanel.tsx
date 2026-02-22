import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { fetchDeveloperStandups } from "../../store/standup.slice";
import StandupModal from "./StandupForm";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface Props{
    projectId:string
}

// Mood emoji mapping
const moodEmojiMap: Record<string, { emoji: string; color: string }> = {
    HAPPY: { emoji: "😊", color: "bg-green-100 text-green-700" },
    GOOD: { emoji: "🙂", color: "bg-blue-100 text-blue-700" },
    NEUTRAL: { emoji: "😐", color: "bg-gray-100 text-gray-700" },
    STRESSED: { emoji: "😓", color: "bg-yellow-100 text-yellow-700" },
    BLOCKED: { emoji: "🚫", color: "bg-red-100 text-red-700" },
};

const DevStandupPanel = ({projectId}:Props) => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.devStandup)
    const [openModal, setOpenModal] = useState(false);
    
    useEffect(() => {
        dispatch(fetchDeveloperStandups(projectId))
    }, [dispatch, projectId])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Spinner size="lg" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="py-8 text-center">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }
    
    if (!data) return null;

    const getMoodInfo = (mood: string) => {
        return moodEmojiMap[mood] || { emoji: "😐", color: "bg-gray-100 text-gray-700" };
    };

    return (
        <div className="space-y-4">
            {/* Today's Standup Card - Compact */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-sm font-medium text-gray-700">Today's Standup</h2>
                </div>

                <div className="p-4">
                    {data.todayStandup ? (
                        <div className="space-y-3">
                            {/* Yesterday */}
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-2 text-xs font-medium text-gray-500">Yesterday</span>
                                <span className="col-span-10 text-sm text-gray-800">{data.todayStandup.yesterday}</span>
                            </div>

                            {/* Today */}
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-2 text-xs font-medium text-gray-500">Today</span>
                                <span className="col-span-10 text-sm text-gray-800">{data.todayStandup.today}</span>
                            </div>

                            {/* Mood */}
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-2 text-xs font-medium text-gray-500">Mood</span>
                                <div className="col-span-10">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getMoodInfo(data.todayStandup.mood).color}`}>
                                        <span>{getMoodInfo(data.todayStandup.mood).emoji}</span>
                                        <span>{data.todayStandup.mood}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">No standup submitted today</p>
                            <button
                                onClick={() => setOpenModal(true)}
                                className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* History Section - Compact */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-sm font-medium text-gray-700">Standup History</h2>
                    <span className="text-xs text-gray-500">{data.history.length} entries</span>
                </div>

                <div className="p-4">
                    {data.history.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-2">No history yet</p>
                    ) : (
                        <div className="space-y-3">
                            {data.history.map((standup) => {
                                const moodInfo = getMoodInfo(standup.mood);
                                
                                return (
                                    <div key={standup.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                        {/* Date and Mood */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400">
                                                {new Date(standup.standupDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${moodInfo.color}`}>
                                                <span>{moodInfo.emoji}</span>
                                                <span>{standup.mood}</span>
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1.5">
                                            <div className="text-xs">
                                                <span className="text-gray-500 w-16 inline-block">Yesterday:</span>
                                                <span className="text-gray-700">{standup.yesterday}</span>
                                            </div>
                                            <div className="text-xs">
                                                <span className="text-gray-500 w-16 inline-block">Today:</span>
                                                <span className="text-gray-700">{standup.today}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Standup Modal */}
            {openModal && (
                <StandupModal
                    projectId={projectId}
                    todayStandup={data.todayStandup}
                    onClose={() => setOpenModal(false)}
                />
            )}
        </div>
    );
};

export default DevStandupPanel;
