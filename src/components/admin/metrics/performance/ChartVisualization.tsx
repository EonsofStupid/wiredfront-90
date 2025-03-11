
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Clock } from "lucide-react";
import { MetricDefinition, PerformanceDataPoint } from "@/hooks/admin/metrics/usePerformanceChartData";

interface ChartVisualizationProps {
  data: PerformanceDataPoint[];
  chartType: 'line' | 'area';
  activeMetric: string;
  currentMetric: MetricDefinition;
}

export function ChartVisualization({ 
  data, 
  chartType, 
  activeMetric, 
  currentMetric 
}: ChartVisualizationProps) {
  return (
    <div className="relative z-10">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
                unit={currentMetric.unit}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.8)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
                itemStyle={{ color: currentMetric.color }}
                labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                formatter={(value) => [`${value}${currentMetric.unit}`, currentMetric.name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={currentMetric.color} 
                strokeWidth={2}
                dot={{ fill: currentMetric.color, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
                unit={currentMetric.unit}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(26, 31, 44, 0.8)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
                itemStyle={{ color: currentMetric.color }}
                labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                formatter={(value) => [`${value}${currentMetric.unit}`, currentMetric.name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={currentMetric.color} 
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${activeMetric})`}
                dot={{ fill: currentMetric.color, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2, fill: 'white' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center mt-4 text-white/60 text-xs">
        <Clock className="h-3 w-3 mr-1" /> Data refreshes every 30 seconds
      </div>
    </div>
  );
}
