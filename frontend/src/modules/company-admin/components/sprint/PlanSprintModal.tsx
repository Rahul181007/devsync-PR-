import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getProjectTasks } from "../../store/task.slice";
import toast from "react-hot-toast";
import { planSprint } from "../../store/sprint.slice";
import { 
  X, 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  Layers, 
  CheckSquare,
  AlertCircle,
  Loader2,
  Sparkles,

} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    sprintId: string;
}

export const PlanSprintModal = ({
    isOpen,
    onClose,
    projectId,
    sprintId,
}: Props) => {
    const dispatch = useAppDispatch();

    const { tasks } = useAppSelector((state) => state.companyAdminTask);

    const [selectedStories, setSelectedStories] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (isOpen) {
            dispatch(getProjectTasks(projectId));
            setSelectedStories([]);
        }
    }, [dispatch, isOpen, projectId]);

    if (!isOpen) return null;

    // ✅ Only STORIES
    const backlogStories = tasks.filter(
        (task) => task.type === "STORY" && !task.sprintId
    );

    console.log(backlogStories);

    const MAX_POINTS = 20;

    const toggleStory = (storyId: string) => {
        setSelectedStories((prev) => {
            // remove if already selected
            if (prev.includes(storyId)) {
                return prev.filter((id) => id !== storyId);
            }

            const story = backlogStories.find((s) => s.id === storyId);
            const newTotal = totalPoints + (story?.storyPoints || 0);

            if (newTotal > MAX_POINTS) {
                toast.error("Sprint capacity exceeded!");
                return prev;
            }

            return [...prev, storyId];
        });
    };

    // ✅ Total Story Points (LIVE)
    const totalPoints = selectedStories.reduce((sum, id) => {
        const story = backlogStories.find((s) => s.id === id);
        return sum + (story?.storyPoints || 0);
    }, 0);

    const handleSubmit = async () => {
        if (selectedStories.length === 0) {
            toast.error("Select at least one story");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await dispatch(
                planSprint({
                    projectId,
                    sprintId,
                    storyIds: selectedStories,
                })
            );

            if (planSprint.fulfilled.match(result)) {
                toast.success("Stories added to sprint");
                onClose();
            }

            if (planSprint.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const percentageUsed = Math.min((totalPoints / MAX_POINTS) * 100, 100);
    const isOverCapacity = totalPoints > MAX_POINTS;

    return (
        <div className="fixed inset-0 bg-linear-to-br from-black/70 to-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 duration-300">
                
                {/* Header with Gradient */}
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Plan Sprint
                                </h2>
                                <p className="text-blue-100 text-sm mt-0.5">
                                    Select stories for this sprint
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <Layers className="w-3.5 h-3.5" />
                                <span>Available Stories</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {backlogStories.length}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Selected</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {selectedStories.length}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Total Points</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {totalPoints}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity Section */}
                <div className="px-6 pt-5 pb-3 border-b border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm font-medium text-gray-700">Sprint Capacity</span>
                            <span className="text-xs text-gray-500 ml-2">Max {MAX_POINTS} points</span>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-semibold ${isOverCapacity ? 'text-red-600' : 'text-green-600'}`}>
                                {totalPoints}
                            </span>
                            <span className="text-xs text-gray-500"> / {MAX_POINTS}</span>
                            <span className={`text-xs ml-2 font-medium ${isOverCapacity ? 'text-red-500' : 'text-gray-500'}`}>
                                ({Math.round(percentageUsed)}%)
                            </span>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${
                                    isOverCapacity
                                        ? "bg-linear-to-r from-red-500 to-red-600"
                                        : percentageUsed > 80
                                        ? "bg-linear-to-r from-yellow-500 to-orange-500"
                                        : "bg-linear-to-r from-green-500 to-emerald-500"
                                }`}
                                style={{ width: `${percentageUsed}%` }}
                            />
                        </div>
                    </div>

                    {isOverCapacity && (
                        <div className="mt-2 flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-xs font-medium">
                                Exceeds sprint capacity by {totalPoints - MAX_POINTS} points
                            </p>
                        </div>
                    )}
                </div>

                {/* Story List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {backlogStories.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No backlog stories available</p>
                            <p className="text-sm text-gray-400 mt-1">Create stories to plan your sprint</p>
                        </div>
                    ) : (
                        backlogStories.map((story) => {
                            const isSelected = selectedStories.includes(story.id);
                            const storyPoints = story.storyPoints || 0;

                            return (
                                <div
                                    key={story.id}
                                    className={`group relative rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? "border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50 shadow-md shadow-blue-100"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
                                    }`}
                                    onClick={() => toggleStory(story.id)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Checkbox */}
                                            <div className="shrink-0 pt-0.5">
                                                {isSelected ? (
                                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                                                )}
                                            </div>

                                            {/* Story Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {story.code}
                                                    </span>
                                                    {storyPoints > 0 && (
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                            storyPoints <= 3 ? 'bg-green-100 text-green-700' :
                                                            storyPoints <= 8 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {storyPoints} pts
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-800'} line-clamp-2`}>
                                                    {story.title}
                                                </h3>
                                            </div>

                                            {/* Arrow indicator */}
                                            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50/50 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded-lg px-3 py-1.5">
                                <span className="text-sm font-semibold text-blue-700">
                                    {selectedStories.length}
                                </span>
                                <span className="text-xs text-blue-600 ml-1">
                                    story{selectedStories.length !== 1 ? 's' : ''} selected
                                </span>
                            </div>
                            {selectedStories.length > 0 && !isOverCapacity && (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs font-medium">Ready to plan</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={
                                    selectedStories.length === 0 ||
                                    isSubmitting ||
                                    totalPoints > MAX_POINTS
                                }
                                className="relative px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Planning...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Plan Sprint</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add this to your global CSS or component CSS
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slide-in-from-bottom-4 {
    from {
        transform: translateY(1rem);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-in {
    animation-duration: 0.2s;
    animation-fill-mode: both;
}

.fade-in {
    animation-name: fade-in;
}

.slide-in-from-bottom-4 {
    animation-name: slide-in-from-bottom-4;
}
`;

// Inject styles (optional - add to your main CSS file instead)
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}