import type { DeveloperActivityItem } from "../../types/dashboard.types";

interface Props {
  activity: DeveloperActivityItem[];
}

const ActivityFeed = ({ activity }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Recent Activity
        </h2>
        {activity.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {activity.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {activity.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No activity yet</p>
          </div>
        )}

        {activity.map((item, index) => (
          <div key={index} className="group">
            <div className="flex items-start space-x-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {item.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {index < activity.length - 1 && (
              <div className="ml-2 mt-3 pl-4 border-l-2 border-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;