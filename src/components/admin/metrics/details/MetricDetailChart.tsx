
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/utils/admin/metrics/sampleData";

interface MetricDetailChartProps {
  data: Array<{ date: string; value: number }>;
}

export function MetricDetailChart({ data }: MetricDetailChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[250px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            tickFormatter={formatDate}
            axisLine={{ stroke: '#333' }}
            tickLine={{ stroke: '#333' }}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
            tickLine={{ stroke: '#333' }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(26, 31, 44, 0.9)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(8px)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            labelFormatter={(value) => `Date: ${formatDate(value)}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8B5CF6" 
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
