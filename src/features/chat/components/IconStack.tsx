
import React from 'react';
import { motion } from 'framer-motion';
import { Image, Code, Cpu, BookOpen } from 'lucide-react';
import { useChatModeStore } from '@/stores/features/chat/modeStore';

interface IconStackProps {
  position?: 'left' | 'right';
}

export const IconStack: React.FC<IconStackProps> = ({ position = 'right' }) => {
  const { setMode } = useChatModeStore();
  
  return (
    <motion.div 
      className={`chat-icon-stack ${position}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.button
        className="chat-icon-button bg-gradient-to-r from-neon-green/80 to-neon-green/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMode('dev')}
        aria-label="Developer Mode"
      >
        <Code className="h-4 w-4" />
      </motion.button>
      
      <motion.button
        className="chat-icon-button bg-gradient-to-r from-neon-pink/80 to-neon-pink/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMode('image')}
        aria-label="Image Generation"
      >
        <Image className="h-4 w-4" />
      </motion.button>
      
      <motion.button
        className="chat-icon-button bg-gradient-to-r from-neon-purple/80 to-neon-purple/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMode('training')}
        aria-label="Training Mode"
      >
        <BookOpen className="h-4 w-4" />
      </motion.button>
      
      <motion.button
        className="chat-icon-button bg-gradient-to-r from-neon-blue/80 to-neon-blue/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMode('planning')}
        aria-label="Planning Mode"
      >
        <Cpu className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
};
