import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WorklogTrendItem } from "../../types/dashboard.types";

interface Props {
    data: WorklogTrendItem[]
}

const WorklogChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-linear-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-100 h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No worklog data</p>
          <p className="text-gray-400 text-sm mt-1">No entries found for the selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Worklog Trend</h3>
            <p className="text-sm text-gray-500 mt-0.5">Hours logged over time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Hours</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: "280px" }} className="px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B7280' } }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{
                fontWeight: '600',
                color: '#374151',
                marginBottom: '4px'
              }}
              itemStyle={{
                color: '#3B82F6',
                padding: '2px 0'
              }}

            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{
                fill: '#3b82f6',
                stroke: 'white',
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                fill: '#2563eb',
                stroke: 'white',
                strokeWidth: 2,
                r: 6
              }}
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorklogChart;
