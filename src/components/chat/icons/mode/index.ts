
import { Code, MessageSquare, Image, GraduationCap } from 'lucide-react';

// Export mode icons for reuse throughout the application
export const ModeIcons = {
  dev: Code,
  chat: MessageSquare,
  image: Image,
  training: GraduationCap
};

export type ModeIconType = keyof typeof ModeIcons;
