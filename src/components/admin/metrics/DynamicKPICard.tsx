
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { useEffect, useState } from "react";

interface DynamicKPICardProps {
  title: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  onClick?: () => void;
}

export function DynamicKPICard({ title, value, unit, trend, change, onClick }: DynamicKPICardProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all hover:scale-105",
        "bg-gradient-to-br from-background/50 to-background/10",
        "backdrop-blur-lg border border-border/50",
        "hover:border-border/80",
        isPulsing && "animate-pulse"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn(
          "flex items-center space-x-1",
          trend === 'up' && "text-green-500",
          trend === 'down' && "text-red-500"
        )}>
          {trend === 'up' && <ArrowUp className="h-4 w-4" />}
          {trend === 'down' && <ArrowDown className="h-4 w-4" />}
          {trend === 'neutral' && <Minus className="h-4 w-4" />}
          <span className="text-sm">{change}%</span>
        </div>
      </div>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-bold">
          {value.toLocaleString()}
        </div>
        {unit && (
          <div className="ml-1 text-sm font-medium text-muted-foreground">
            {unit}
          </div>
        )}
      </div>
    </Card>
  );
}
