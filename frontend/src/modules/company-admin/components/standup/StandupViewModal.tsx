import { useAppSelector } from "../../../../store/hook";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Mood emoji mapping
const moodEmojiMap: Record<string, { emoji: string; color: string }> = {
  HAPPY: { emoji: "😄", color: "bg-green-100 text-green-700" },
  GOOD: { emoji: "🙂", color: "bg-blue-100 text-blue-700" },
  NEUTRAL: { emoji: "😐", color: "bg-gray-100 text-gray-700" },
  STRESSED: { emoji: "😓", color: "bg-yellow-100 text-yellow-700" },
  BLOCKED: { emoji: "🚫", color: "bg-red-100 text-red-700" },
};

const StandupViewModal = ({ isOpen, onClose }: Props) => {
  const { selectedStandup, loading } = useAppSelector(
    (state) => state.companyStandup
  );

  if (!isOpen) return null;

  const moodInfo = selectedStandup?.mood 
    ? moodEmojiMap[selectedStandup.mood as keyof typeof moodEmojiMap] 
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header with gradient */}
        <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Standup Submission
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors text-xl font-medium"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Spinner size="lg" />
              <p className="mt-3 text-sm text-gray-500">Loading submission...</p>
            </div>
          ) : selectedStandup ? (
            <div className="space-y-5">
              {/* Yesterday Section */}
              <Section title="Yesterday">
                <p className="whitespace-pre-wrap">{selectedStandup.yesterday}</p>
              </Section>

              {/* Today Section */}
              <Section title="Today">
                <p className="whitespace-pre-wrap">{selectedStandup.today}</p>
              </Section>

              {/* Blockers Section */}
              <Section 
                title="Blockers" 
                variant={selectedStandup.blockers ? "warning" : "default"}
              >
                {selectedStandup.blockers ? (
                  <p className="whitespace-pre-wrap">{selectedStandup.blockers}</p>
                ) : (
                  <p className="text-gray-400 italic">No blockers reported</p>
                )}
              </Section>

              {/* Footer with Mood and Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                {/* Mood Badge */}
                {moodInfo && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Mood:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${moodInfo.color}`}>
                      <span className="text-base">{moodInfo.emoji}</span>
                      <span className="font-medium">
                        {selectedStandup.mood.charAt(0) + selectedStandup.mood.slice(1).toLowerCase()}
                      </span>
                    </span>
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated: {new Date(selectedStandup.updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No standup submission found</p>
            </div>
          )}
        </div>

        {/* Footer with Close button */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Section component with variants
const Section = ({ 
  title, 
  children,
  variant = "default" 
}: { 
  title: string; 
  children: React.ReactNode;
  variant?: "default" | "warning";
}) => {
  const variantStyles = {
    default: "bg-gray-50 border-gray-100",
    warning: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {title}
        </span>
        {variant === "warning" && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Blockers
          </span>
        )}
      </div>
      <div className={`p-4 rounded-xl border ${variantStyles[variant]}`}>
        {children}
      </div>
    </div>
  );
};

export default StandupViewModal;