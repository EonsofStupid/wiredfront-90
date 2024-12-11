import { motion } from "framer-motion";
import { Activity, Code, Database, Settings, Search, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardProps, DashboardMetric } from "@/types/dashboard/common";
import { MetricsPanel } from "@/types/dashboard/metrics";
import { AnalyticsPanel } from "@/types/dashboard/analytics";

const Dashboard: React.FC<DashboardProps> = ({ initialData, refreshInterval = 30000 }) => {
  return (
    <div className="min-h-screen bg-dark grid-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-neon-blue/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="gradient-text text-2xl font-bold">wiredFRONT</h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Code Editor Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card neon-glow col-span-1 lg:col-span-2 h-[500px] p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="gradient-text text-xl">Code Editor</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-neon-blue">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neon-pink">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-2rem)] bg-dark-lighter/50 rounded-lg p-4">
              <pre className="text-neon-blue">
                <code>// Your code here</code>
              </pre>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card neon-glow p-4"
          >
            <h2 className="gradient-text text-xl mb-4">Analytics</h2>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-dark-lighter/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neon-blue">Metric {i + 1}</span>
                    <span className="text-neon-pink">85%</span>
                  </div>
                  <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-pink"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Panels */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-card neon-glow p-4"
            >
              <h2 className="gradient-text text-xl mb-4">Panel {i + 1}</h2>
              <div className="bg-dark-lighter/50 rounded-lg p-4 h-[200px] flex items-center justify-center">
                <span className="text-neon-blue">Content coming soon</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;