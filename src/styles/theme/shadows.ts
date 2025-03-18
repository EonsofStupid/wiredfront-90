
import { coreColors } from './core-variables';

export const shadows = {
  // Basic shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Neon shadows
  'neon-blue': `0 0 5px ${coreColors.neonBlue}, 0 0 15px ${coreColors.neonBlue}`,
  'neon-pink': `0 0 5px ${coreColors.neonPink}, 0 0 15px ${coreColors.neonPink}`,
  'neon-violet': `0 0 5px ${coreColors.neonViolet}, 0 0 15px ${coreColors.neonViolet}`,
  
  // Cyberpunk shadows
  'cyber-glow': `0 0 10px ${coreColors.neonBlue}, 0 0 20px ${coreColors.neonPink}`,
  'cyber-button': `0 0 5px ${coreColors.neonBlue}, 0 0 10px rgba(0, 255, 255, 0.5)`,
  'cyber-card': `0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(139, 92, 246, 0.3)`,
  
  // UI element shadows
  'tooltip': '0 3px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(139, 92, 246, 0.2)',
  'popup': '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.3)',
  'dropdown': '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(139, 92, 246, 0.2)',
  
  // Interactive shadows
  'hover': '0 6px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(139, 92, 246, 0.4)',
  'active': '0 2px 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(139, 92, 246, 0.3)',
  'button-glow': '0 0 15px rgba(0, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.4)',
  
  // Inner shadows
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  'inner-glow': `inset 0 0 10px ${coreColors.neonBlue}, inset 0 0 15px rgba(0, 255, 255, 0.3)`,
  
  // Special effects
  'pulse': '0 0 0 rgba(139, 92, 246, 0.4)',
  'pulse-active': '0 0 20px rgba(139, 92, 246, 0.8)',
  
  // No shadow
  'none': 'none',
};
