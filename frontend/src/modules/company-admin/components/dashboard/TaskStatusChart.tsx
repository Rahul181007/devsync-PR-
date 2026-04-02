import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CompanyDashboardData } from "../../types/dashboard.types";

interface Props {
    data:CompanyDashboardData
}
const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const TaskStatusChart = ({data}:Props) => {

const chartData = [
  { name: "Completed", value: data.completedTasks, fill: "#22c55e" },
  { name: "Overdue", value: data.overdueTasks, fill: "#ef4444" },
  {
    name: "Remaining",
    value: data.totalTasks - data.completedTasks,
    fill: "#3b82f6",
  },
];

const completionPercentage = ((data.completedTasks / data.totalTasks) * 100).toFixed(1);

  return (
    <div className="bg-linear-to-br from-white to-gray-50/50 p-6 rounded-2xl shadow-lg border border-gray-100 h-80 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 tracking-tight">Task Status</h3>
        <div className="flex gap-2">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
              <span className="text-xs text-gray-500 font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            strokeWidth={2}
            stroke="#ffffff"
            label={({ name, percent }) => {
              const percentage = percent ? (percent * 100).toFixed(0) : "0";
              return `${name} ${percentage}%`;
            }}
            labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
          >
            {chartData.map((_, index) => (
              <Cell 
                key={index} 
                fill={COLORS[index]} 
                className="cursor-pointer hover:opacity-90 transition-opacity"
                stroke="none"
              />
            ))}
          </Pie>

          <Tooltip 
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: "12px",
              fontWeight: "500"
            }}
            formatter={(value) => {
              if (typeof value === 'number') {
                return [`${value} tasks`, ""];
              }
              return ["0 tasks", ""];
            }}
            labelStyle={{ color: "#374151", fontWeight: "600", marginBottom: "4px" }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Total Tasks:</span> {data.totalTasks}
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">Completion:</span> {completionPercentage}%
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart;
