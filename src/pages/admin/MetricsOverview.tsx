
import React from "react";
import { Card } from "@/components/ui/card";
import { SettingsContainer } from "@/components/admin/settings/layout/SettingsContainer";
import { Activity, Users, Code, Database, Clock } from "lucide-react";

export default function MetricsOverview() {
  return (
    <SettingsContainer title="Admin Metrics" description="Overview of system performance and usage metrics">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard 
          title="API Usage" 
          value="2,453" 
          change="+15%" 
          icon={<Activity className="h-6 w-6 text-neon-blue" />} 
          trend="up"
        />
        <MetricCard 
          title="Active Users" 
          value="342" 
          change="+8%" 
          icon={<Users className="h-6 w-6 text-neon-pink" />}
          trend="up" 
        />
        <MetricCard 
          title="Model Requests" 
          value="12,876" 
          change="+32%" 
          icon={<Code className="h-6 w-6 text-neon-green" />}
          trend="up" 
        />
        <MetricCard 
          title="Database Usage" 
          value="45%" 
          change="-3%" 
          icon={<Database className="h-6 w-6 text-neon-purple" />}
          trend="down" 
        />
        <MetricCard 
          title="Response Time" 
          value="240ms" 
          change="-12%" 
          icon={<Clock className="h-6 w-6 text-neon-yellow" />}
          trend="down" 
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <StatusItem label="API Services" status="operational" />
            <StatusItem label="Database" status="operational" />
            <StatusItem label="Authentication" status="operational" />
            <StatusItem label="Storage" status="degraded" />
            <StatusItem label="AI Models" status="operational" />
          </div>
        </Card>
      </div>
    </SettingsContainer>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const MetricCard = ({ title, value, change, icon, trend }: MetricCardProps) => {
  return (
    <Card className="p-6 hover-scale">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className={`mt-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change} from last month
          </p>
        </div>
        <div className="bg-dark-lighter/40 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
};

interface StatusItemProps {
  label: string;
  status: 'operational' | 'degraded' | 'down';
}

const StatusItem = ({ label, status }: StatusItemProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
        <span className="text-sm capitalize">{status}</span>
      </div>
    </div>
  );
};
