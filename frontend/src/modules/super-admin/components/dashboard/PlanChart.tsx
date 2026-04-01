import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { PlanDistribution } from "../../typess/dashboard.types";

interface Props {
  data: PlanDistribution[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      plan: string;
      count: number;
      total: number;
    };
  }>;
}

// Custom Tooltip component - defined outside
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload[0]?.payload?.total || 0;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {payload[0].value} users
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {((payload[0].value / total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const PlanChart = ({ data }: Props) => {
  // Custom colors for different plans
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  
  // Calculate total for tooltip
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Add total to each data item for tooltip access
  const dataWithTotal = data.map(item => ({
    ...item,
    total
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            dataKey="count"
            nameKey="plan"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
              const RADIAN = Math.PI / 180;
              const radius = (outerRadius || 0) * 1.1;
              const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
              const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="#6B7280"
                  textAnchor={x > (cx || 0) ? "start" : "end"}
                  dominantBaseline="central"
                  className="text-xs font-medium"
                >
                  {`${name} ${((percent || 0) * 100).toFixed(0)}%`}
                </text>
              );
            }}
            labelLine={false}
            stroke="none"
          >
            {dataWithTotal.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlanChart;