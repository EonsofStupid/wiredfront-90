import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useChatCombined } from '@/stores/features/chat';
import { ChatMode } from '@/types/chat';
import { validateChatMode } from '@/utils/validation/chatTypes';
import { motion } from 'framer-motion';
import {
    Code,
    Database,
    GraduationCap,
    Image,
    MessageSquare,
    Mic,
    PlaneLanding
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ChatFeaturesProps {
  className?: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

function FeatureCard({ title, description, icon, isActive, onClick }: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer",
        "transition-all duration-300 ease-out bg-gray-900/50",
        "hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        isActive
          ? "border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20"
          : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs text-gray-400 text-center mt-1">{description}</p>
    </motion.div>
  );
}

export function ChatFeatures({ className }: ChatFeaturesProps) {
  const { currentMode, setMode } = useChatCombined();
  const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleModeSelect = (newMode: ChatMode) => {
    const validMode = validateChatMode(newMode, { fallback: 'chat' });
    setMode(validMode);
    setIsModeDialogOpen(false);
    toast.success(`Switched to ${validMode} mode`);
  };

  const toggleVoiceRecognition = () => {
    setIsVoiceActive(!isVoiceActive);
    // Implement voice recognition logic here
    toast.info(isVoiceActive ? 'Voice recognition stopped' : 'Voice recognition started');
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModeDialogOpen(true)}
        className="hover:bg-white/10 chat-feature-button"
        aria-label="Select chat mode"
      >
        <span className="flex items-center gap-1">
          {currentMode === 'dev' && <Code className="h-4 w-4 text-cyan-400" />}
          {currentMode === 'image' && <Image className="h-4 w-4 text-pink-400" />}
          {currentMode === 'training' && <GraduationCap className="h-4 w-4 text-purple-400" />}
          {currentMode === 'planning' && <PlaneLanding className="h-4 w-4 text-orange-400" />}
          {currentMode === 'chat' && <MessageSquare className="h-4 w-4 text-blue-400" />}
          <span className="capitalize">{currentMode}</span>
        </span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsStatusDialogOpen(true)}
        className="hover:bg-white/10 chat-feature-button"
        aria-label="View status"
      >
        <Database className="h-4 w-4 text-green-400" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleVoiceRecognition}
        className={cn(
          "hover:bg-white/10 chat-feature-button",
          isVoiceActive && "text-red-400"
        )}
        aria-label="Toggle voice recognition"
      >
        <Mic className="h-4 w-4" />
      </Button>

      <Dialog open={isModeDialogOpen} onOpenChange={setIsModeDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black/80 border-purple-500/50 text-white backdrop-blur-md cyber-bg">
          <DialogHeader>
            <DialogTitle className="text-center text-neon-blue">Select Chat Mode</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <FeatureCard
              title="Chat"
              description="General assistance"
              icon={<MessageSquare className="h-8 w-8 text-neon-blue" />}
              isActive={currentMode === 'chat'}
              onClick={() => handleModeSelect('chat')}
            />

            <FeatureCard
              title="Developer"
              description="Code assistance"
              icon={<Code className="h-8 w-8 text-neon-green" />}
              isActive={currentMode === 'dev'}
              onClick={() => handleModeSelect('dev')}
            />

            <FeatureCard
              title="Image"
              description="Generate images"
              icon={<Image className="h-8 w-8 text-neon-pink" />}
              isActive={currentMode === 'image'}
              onClick={() => handleModeSelect('image')}
            />

            <FeatureCard
              title="Training"
              description="Learn and practice"
              icon={<GraduationCap className="h-8 w-8 text-orange-400" />}
              isActive={currentMode === 'training'}
              onClick={() => handleModeSelect('training')}
            />

            <FeatureCard
              title="Planning"
              description="Architecture planning"
              icon={<PlaneLanding className="h-8 w-8 text-cyan-400" />}
              isActive={currentMode === 'planning'}
              onClick={() => handleModeSelect('planning')}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black/80 border-purple-500/50 text-white backdrop-blur-md cyber-bg">
          <DialogHeader>
            <DialogTitle className="text-center text-neon-blue">System Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">AI Provider</span>
              <span className="text-white">Default</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Status</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Mode</span>
              <span className="text-white capitalize">{currentMode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Voice Recognition</span>
              <span className={isVoiceActive ? "text-green-400" : "text-red-400"}>
                {isVoiceActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatFeatures;
