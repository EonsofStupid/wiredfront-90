import { motion } from "framer-motion";
import { X, Search, FileText, Settings, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AITaskPanelProps {
  onClose: () => void;
}

export const AITaskPanel = ({ onClose }: AITaskPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-enhanced p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">AI Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="What would you like me to help you with?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskCard
          icon={FileText}
          title="File Management"
          description="Organize, edit, and manage your files"
        />
        <TaskCard
          icon={Terminal}
          title="Automation"
          description="Create and run automated tasks"
        />
        <TaskCard
          icon={Settings}
          title="System Settings"
          description="Configure AI behavior and permissions"
        />
      </div>
    </motion.div>
  );
};

interface TaskCardProps {
  icon: any;
  title: string;
  description: string;
}

const TaskCard = ({ icon: Icon, title, description }: TaskCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card-interactive p-4"
    >
      <Icon className="h-6 w-6 mb-2 text-neon-blue" />
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
};