
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformanceChartData } from "@/hooks/admin/metrics/usePerformanceChartData";
import { ChartHeader } from "./performance/ChartHeader";
import { ChartControls } from "./performance/ChartControls";
import { ChartVisualization } from "./performance/ChartVisualization";

export function PerformanceChart() {
  const {
    data,
    activeMetric,
    setActiveMetric,
    chartType,
    setChartType,
    currentMetric,
    metrics
  } = usePerformanceChartData();

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
        <ChartHeader 
          title="Performance Metrics" 
          description="Historical system performance data" 
        />
        
        <ChartControls 
          metrics={metrics}
          activeMetric={activeMetric}
          setActiveMetric={setActiveMetric}
          chartType={chartType}
          setChartType={setChartType}
        />
      </div>
      
      <ChartVisualization 
        data={data}
        chartType={chartType}
        activeMetric={activeMetric}
        currentMetric={currentMetric}
      />
    </motion.div>
  );
}
