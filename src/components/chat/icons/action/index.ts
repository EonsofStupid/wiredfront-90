
import { 
  Command, 
  FileSearch, 
  Brain, 
  Zap, 
  Settings, 
  Mic, 
  Database, 
  GitBranch,
  Sparkles
} from 'lucide-react';

// Export action icons for reuse throughout the application
export const ActionIcons = {
  command: Command,
  search: FileSearch,
  memory: Brain,
  automation: Zap,
  settings: Settings,
  voice: Mic,
  database: Database,
  github: GitBranch,
  ai: Sparkles
};

export type ActionIconType = keyof typeof ActionIcons;
