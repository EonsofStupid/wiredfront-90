
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  providerId: string;
  onSelect: () => void;
}

export function ModeCard({ title, description, icon, isActive, onSelect }: ModeCardProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer",
        "transition-all duration-300 ease-out bg-gray-900/50",
        isActive 
          ? "border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20" 
          : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50"
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs text-gray-400 text-center mt-1">{description}</p>
    </motion.div>
  );
}
