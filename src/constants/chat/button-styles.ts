import { MessageSquare, MessageCircle, Bot, Sparkles, Zap } from 'lucide-react';
import { ButtonStyle } from '@/types/chat/button-styles';

export const buttonStyles: Record<string, ButtonStyle> = {
  wfpulse: {
    name: 'WFPulse',
    theme: {
      primary: '#00ff00',
      secondary: '#00ccff',
      accent: '#ff00ff',
      background: 'rgba(0, 0, 0, 0.8)',
      glow: '0 0 10px rgba(0, 255, 0, 0.5)',
      border: '1px solid rgba(0, 255, 0, 0.3)'
    },
    animation: {
      hover: 'scale(1.1)',
      pulse: 'pulse 2s infinite',
      icon: 'rotate 2s infinite'
    },
    icon: {
      default: <MessageSquare className="h-5 w-5" />,
      hover: <MessageSquare className="h-5 w-5 animate-spin" />
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    theme: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ff0000',
      background: 'rgba(0, 0, 0, 0.9)',
      glow: '0 0 15px rgba(255, 0, 255, 0.5)',
      border: '1px solid rgba(255, 0, 255, 0.3)'
    },
    animation: {
      hover: 'scale(1.05) translateY(-2px)',
      pulse: 'cyber-pulse 1.5s infinite',
      icon: 'cyber-rotate 3s infinite'
    },
    icon: {
      default: <MessageCircle className="h-5 w-5" />,
      hover: <MessageCircle className="h-5 w-5 animate-cyber" />
    }
  },
  neon: {
    name: 'Neon',
    theme: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: 'rgba(0, 0, 0, 0.85)',
      glow: '0 0 20px rgba(0, 255, 255, 0.5)',
      border: '1px solid rgba(0, 255, 255, 0.3)'
    },
    animation: {
      hover: 'scale(1.1) rotate(5deg)',
      pulse: 'neon-pulse 1.8s infinite',
      icon: 'neon-rotate 2.5s infinite'
    },
    icon: {
      default: <Sparkles className="h-5 w-5" />,
      hover: <Sparkles className="h-5 w-5 animate-neon" />
    }
  },
  matrix: {
    name: 'Matrix',
    theme: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#009900',
      background: 'rgba(0, 0, 0, 0.95)',
      glow: '0 0 15px rgba(0, 255, 0, 0.3)',
      border: '1px solid rgba(0, 255, 0, 0.2)'
    },
    animation: {
      hover: 'scale(1.05) translateY(-1px)',
      pulse: 'matrix-pulse 2.2s infinite',
      icon: 'matrix-rotate 4s infinite'
    },
    icon: {
      default: <Bot className="h-5 w-5" />,
      hover: <Bot className="h-5 w-5 animate-matrix" />
    }
  },
  plasma: {
    name: 'Plasma',
    theme: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: 'rgba(0, 0, 0, 0.9)',
      glow: '0 0 25px rgba(255, 0, 255, 0.4)',
      border: '1px solid rgba(255, 0, 255, 0.2)'
    },
    animation: {
      hover: 'scale(1.15) rotate(-5deg)',
      pulse: 'plasma-pulse 1.6s infinite',
      icon: 'plasma-rotate 2.8s infinite'
    },
    icon: {
      default: <Zap className="h-5 w-5" />,
      hover: <Zap className="h-5 w-5 animate-plasma" />
    }
  }
}; 