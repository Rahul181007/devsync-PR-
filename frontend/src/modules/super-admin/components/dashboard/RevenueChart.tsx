import type { RevenueChart } from "../../typess/dashboard.types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

interface Props {
    data: RevenueChart[];
}

const RevenueCharts = ({ data }: Props) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                        dx={-10}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            padding: '8px 12px'
                        }}
                        labelStyle={{ color: '#6B7280', fontSize: '12px', fontWeight: '500' }}
                        itemStyle={{ color: '#8B5CF6', fontSize: '14px', fontWeight: '600' }}
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6"
                        strokeWidth={2.5}
                        dot={{ fill: '#8B5CF6', stroke: 'white', strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: '#8B5CF6', stroke: 'white', strokeWidth: 2, r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueCharts;