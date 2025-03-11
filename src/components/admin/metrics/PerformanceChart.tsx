
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
import { ArrowUpDown, Clock, Download, LayoutGrid } from "lucide-react";

// Sample data - in a real app this would come from your API
const generateSampleData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      apiLatency: Math.floor(Math.random() * 200) + 100,
      cpuUsage: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 40,
      requestCount: Math.floor(Math.random() * 50) + 150
    });
  }
  
  return data;
};

export function PerformanceChart() {
  const [data, setData] = useState(() => generateSampleData());
  const [activeMetric, setActiveMetric] = useState<'apiLatency' | 'cpuUsage' | 'memory' | 'requestCount'>('apiLatency');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
  // Refreshes data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data];
      // Remove oldest data point
      newData.shift();
      
      // Add new data point
      const now = new Date();
      newData.push({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        apiLatency: Math.floor(Math.random() * 200) + 100,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 40,
        requestCount: Math.floor(Math.random() * 50) + 150
      });
      
      setData(newData);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  const metrics = [
    { id: 'apiLatency', name: 'API Latency', unit: 'ms', color: '#8B5CF6' },
    { id: 'cpuUsage', name: 'CPU Usage', unit: '%', color: '#EC4899' },
    { id: 'memory', name: 'Memory', unit: '%', color: '#0EA5E9' },
    { id: 'requestCount', name: 'Request Count', unit: '', color: '#10B981' }
  ];
  
  const currentMetric = metrics.find(m => m.id === activeMetric)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn(
        "relative p-6 rounded-xl overflow-hidden",
        "bg-gradient-to-br from-[#1A1F2C]/80 to-[#121318]/95",
        "backdrop-blur-lg border border-white/5",
        "shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      )}
    >
      {/* Animated neon lines background */}
      <div className="absolute inset-0 hero--neon-lines opacity-5" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ArrowUpDown className="h-5 w-5 text-[#8B5CF6] mr-2" />
            Performance Metrics
          </h3>
          <p className="text-sm text-white/60 mt-1">Historical system performance data</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Metric Selector */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id as any)}
                className={cn(
                  "px-3 py-1 text-xs font-medium transition-all",
                  activeMetric === metric.id 
                    ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
                    : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
                )}
                style={{
                  boxShadow: activeMetric === metric.id ? `0 0 10px ${metric.color}40` : 'none'
                }}
              >
                {metric.name}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setChartType('line')}
              className={cn(
                "p-1 transition-all",
                chartType === 'line' 
                  ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
                  : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={cn(
                "p-1 transition-all",
                chartType === 'area' 
                  ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white" 
                  : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all"
            onClick={() => {
              // In a real app, this would trigger an export
              alert("Export feature would be implemented here");
            }}
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>
      
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
    </motion.div>
  );
}
