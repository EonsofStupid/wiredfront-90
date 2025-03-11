
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusIndicator } from "./StatusIndicator";
import { AreaChart, Calendar, Clock, Download, ZoomIn } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MetricDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: {
    id: string;
    label: string;
    value: number;
    unit?: string;
    trend: 'up' | 'down' | 'neutral';
    change: number;
    category: string;
    description?: string;
  } | null;
}

// Sample data generator - in a real app this would come from an API
const generateDetailData = (days = 14) => {
  const data = [];
  const now = new Date();
  const baseValue = Math.random() * 300 + 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create some random fluctuation
    const randomFactor = Math.random() * 0.4 - 0.2; // -20% to +20%
    const value = baseValue * (1 + randomFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  
  return data;
};

export function MetricDetailsDialog({ open, onOpenChange, metric }: MetricDetailsDialogProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | '90d'>('14d');
  const [detailData, setDetailData] = useState(() => generateDetailData());
  
  // Update data when time range changes
  const updateTimeRange = (range: '7d' | '14d' | '30d' | '90d') => {
    setTimeRange(range);
    const days = parseInt(range.replace('d', ''));
    setDetailData(generateDetailData(days));
  };
  
  if (!metric) return null;
  
  // Format date for display in tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-[#1A1F2C] border-[#8B5CF6]/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]">
              {metric.label}
            </span>
            <StatusIndicator 
              status={metric.trend === 'up' ? 'healthy' : metric.trend === 'down' ? 'critical' : 'warning'} 
              label={metric.trend === 'up' ? 'Increasing' : metric.trend === 'down' ? 'Decreasing' : 'Stable'} 
            />
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Detailed analytics and historical data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Main KPI */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-white/70">Current Value</h3>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {metric.value.toLocaleString()} {metric.unit}
              </div>
              <div className="text-sm mt-1">
                <span className={cn(
                  "inline-flex items-center",
                  metric.trend === 'up' ? "text-green-500" : 
                  metric.trend === 'down' ? "text-red-500" : 
                  "text-yellow-500"
                )}>
                  {metric.change}% from previous period
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="hover:bg-white/10 p-2 rounded">
                <Download size={16} className="text-white/70" />
              </button>
              <button className="hover:bg-white/10 p-2 rounded">
                <ZoomIn size={16} className="text-white/70" />
              </button>
            </div>
          </div>
          
          {/* Time range selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Calendar size={14} />
              <span className="text-sm">Time Range</span>
            </div>
            
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              {(['7d', '14d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => updateTimeRange(range)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-all",
                    timeRange === range
                      ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                      : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={detailData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              </RechartsAreaChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Additional Metrics and Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
              <div className="text-white/70 text-sm">Peak Value</div>
              <div className="text-xl font-medium mt-1">
                {Math.max(...detailData.map(d => d.value)).toLocaleString()} {metric.unit}
              </div>
            </div>
            <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
              <div className="text-white/70 text-sm">Average</div>
              <div className="text-xl font-medium mt-1">
                {Math.round(detailData.reduce((acc, curr) => acc + curr.value, 0) / detailData.length).toLocaleString()} {metric.unit}
              </div>
            </div>
            <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
              <div className="text-white/70 text-sm">Last Updated</div>
              <div className="text-xl font-medium mt-1 flex items-center">
                <Clock size={14} className="mr-1" />
                Just now
              </div>
            </div>
          </div>
          
          {/* Description or Notes */}
          {metric.description && (
            <div className="bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10">
              <div className="text-white/70 text-sm mb-2">Analysis</div>
              <p className="text-white/80 text-sm">{metric.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
