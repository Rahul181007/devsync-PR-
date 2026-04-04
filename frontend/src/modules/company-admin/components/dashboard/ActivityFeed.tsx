import type { ActivityItem } from "../../types/dashboard.types";

interface Props {
  data: ActivityItem[];
}

// 🔹 Helper: time ago
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// 🔹 Icon based on type - Upgraded to professional SVG icons
const getIcon = (type: ActivityItem["type"]) => {
  if (type === "TASK_COMPLETED") {
    return (
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (type === "WORKLOG_ADDED") {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
};

const ActivityFeed = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Activities will appear here once available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Activity Feed</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time updates from your team</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 group"
          >
            <div className="flex gap-3">
              {/* Icon */}
              {getIcon(item.type)}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-relaxed">{item.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
              </div>

              {/* Optional hover indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with activity count */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Showing {data.length} recent {data.length === 1 ? 'activity' : 'activities'}
          </span>
          <button 
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            onClick={() => {/* Scroll to top or load more functionality */}}
          >
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;