
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Code, FileText } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Mobile-optimized homepage with quick access cards
 */
export const MobileHome = () => {
  return (
    <div className="space-y-6 pb-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neon-pink">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard 
            title="Editor"
            icon={<Code className="h-5 w-5 text-neon-blue" />}
            path="/editor"
          />
          <QuickActionCard 
            title="Documents"
            icon={<FileText className="h-5 w-5 text-neon-blue" />}
            path="/documents"
          />
        </div>
      </section>
      
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neon-pink">Recent Activity</h2>
        
        <Card className="bg-dark-lighter border-neon-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActivityItem 
              title="Project Initialized"
              description="New mobile structure created"
              time="Just now"
            />
            <ActivityItem 
              title="Document Created"
              description="Welcome guide for new users"
              time="2 hours ago"
            />
            <ActivityItem 
              title="AI Assistant"
              description="New feature suggestion"
              time="Yesterday"
            />
            
            <Button variant="link" size="sm" className="px-0 text-neon-blue">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neon-pink">Resources</h2>
        
        <Card className="bg-dark-lighter border-neon-blue/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Optimization Tips</h3>
                <p className="text-xs text-neon-pink/70">Improve your workflow</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full border-neon-blue/30 text-neon-blue">
              View Guide
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

/**
 * Quick access card component for common destinations
 */
const QuickActionCard = ({ title, icon, path }: { title: string, icon: React.ReactNode, path: string }) => (
  <Link to={path}>
    <Card className="bg-dark-lighter border-neon-blue/20 hover:bg-dark-lighter/50 transition-colors">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center h-24">
        <div className="mb-2">{icon}</div>
        <h3 className="text-sm font-medium">{title}</h3>
      </CardContent>
    </Card>
  </Link>
);

/**
 * Activity item component for recent actions
 */
const ActivityItem = ({ title, description, time }: { title: string, description: string, time: string }) => (
  <div className="flex items-center justify-between py-1 border-b border-neon-blue/10 last:border-0">
    <div>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-neon-pink/70">{description}</p>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-xs text-neon-blue/70">{time}</span>
      <ArrowRight className="h-3 w-3 text-neon-blue/70" />
    </div>
  </div>
);
