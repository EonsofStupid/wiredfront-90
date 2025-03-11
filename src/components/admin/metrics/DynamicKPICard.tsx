
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DynamicKPICardProps {
  title: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function DynamicKPICard({ 
  title, 
  value, 
  unit, 
  trend, 
  change, 
  icon, 
  onClick 
}: DynamicKPICardProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [gradientDeg, setGradientDeg] = useState(45);

  // Animate the gradient rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientDeg(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation on value change
  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  // Get trend color
  const getTrendColor = () => {
    switch(trend) {
      case 'up': return "from-green-500/80 to-emerald-400/80";
      case 'down': return "from-red-500/80 to-pink-400/80";
      default: return "from-blue-500/80 to-cyan-400/80";
    }
  };

  // Get card gradient based on trend
  const getCardGradient = () => {
    const baseStyle = `bg-gradient-to-br from-[#1A1F2C]/80 to-[#121318]/80`;
    
    switch(trend) {
      case 'up': 
        return `${baseStyle} hover:from-green-900/20 hover:to-emerald-900/10`;
      case 'down': 
        return `${baseStyle} hover:from-red-900/20 hover:to-pink-900/10`;
      default: 
        return `${baseStyle} hover:from-blue-900/20 hover:to-cyan-900/10`;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={cn(
          "p-6 cursor-pointer group relative overflow-hidden h-[140px]",
          getCardGradient(),
          "backdrop-blur-lg border border-white/5",
          "shadow-[0_8px_16px_rgba(0,0,0,0.5)]",
          "transition-all duration-300 ease-in-out",
          "hover:border-[#8B5CF6]/30 hover:shadow-[0_10px_25px_-5px_rgba(139,92,246,0.3)]"
        )}
        onClick={onClick}
        style={{
          boxShadow: trend === 'up' 
            ? '0 4px 20px -5px rgba(16, 185, 129, 0.3)' 
            : trend === 'down' 
              ? '0 4px 20px -5px rgba(239, 68, 68, 0.3)' 
              : '0 4px 20px -5px rgba(6, 182, 212, 0.3)',
        }}
      >
        {/* Glowing accent border */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          )}
          style={{
            background: `linear-gradient(${gradientDeg}deg, transparent 0%, ${trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#06B6D4'} 50%, transparent 100%)`,
            borderRadius: 'inherit',
            padding: '1px',
            filter: 'blur(8px)',
          }}
        />
        
        {/* Card content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {icon && (
                <div className={cn(
                  "p-1.5 rounded-md", 
                  trend === 'up' ? "bg-green-500/20 text-green-400" : 
                  trend === 'down' ? "bg-red-500/20 text-red-400" : 
                  "bg-blue-500/20 text-blue-400"
                )}>
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-medium text-white/80">{title}</h3>
            </div>
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full",
              "bg-gradient-to-r",
              getTrendColor(),
              "text-white text-xs font-medium"
            )}>
              {trend === 'up' && <ArrowUp className="h-3 w-3" />}
              {trend === 'down' && <ArrowDown className="h-3 w-3" />}
              {trend === 'neutral' && <Minus className="h-3 w-3" />}
              <span>{change}%</span>
            </div>
          </div>
          <div className={cn(
            "mt-2 transition-all duration-300",
            isPulsing && "scale-105"
          )}>
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {value.toLocaleString()}
            </div>
            {unit && (
              <div className="mt-1 text-sm font-medium text-white/60">
                {unit}
              </div>
            )}
          </div>
        </div>
        
        {/* Holographic highlight */}
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1) 30%, transparent 60%)',
            transform: `translateX(-100%) rotate(${gradientDeg}deg)`,
            animation: 'holographic 3s linear infinite',
          }}
        />
      </Card>
    </motion.div>
  );
}
