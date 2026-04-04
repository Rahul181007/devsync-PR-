import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { WorklogChartItem } from "../../types/dashboard.types";

interface Props {
  data: WorklogChartItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: WorklogChartItem;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-lg font-bold text-blue-600">
          {payload[0].value} hours
        </p>
      </div>
    );
  }
  return null;
};

const WorklogChart = ({ data }: Props) => {
  const hasData = data && data.length > 0;
  const maxHours = Math.max(...(data?.map((item) => item.hours) || [0]), 1);

  return (
    <div className="w-full h-full">
      {!hasData ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm text-gray-400">No worklog data available</p>
            <p className="text-xs text-gray-300 mt-1">Hours will appear here</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              domain={[0, Math.ceil(maxHours * 1.1)]}
              tickCount={5}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />

            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
                r: 6,
              }}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WorklogChart;