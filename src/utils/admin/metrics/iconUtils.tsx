
import { AreaChart, Cpu, Database, DollarSign, Server, Users, Zap } from "lucide-react";
import { ReactNode } from "react";

export function getMetricIcon(metricName: string): ReactNode {
  const icons = {
    active_users: <Users className="h-5 w-5" />,
    api_requests: <Zap className="h-5 w-5" />,
    response_time: <AreaChart className="h-5 w-5" />,
    cpu_usage: <Cpu className="h-5 w-5" />,
    memory_usage: <Database className="h-5 w-5" />,
    revenue: <DollarSign className="h-5 w-5" />,
  };
  
  // Check if metricName contains revenue (case insensitive)
  if (metricName.toLowerCase().includes('revenue')) {
    return icons.revenue;
  }
  
  return icons[metricName.toLowerCase().replace(/\s/g, '_') as keyof typeof icons] || <Server className="h-5 w-5" />;
}
