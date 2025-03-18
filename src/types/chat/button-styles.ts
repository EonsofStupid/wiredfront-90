import { ReactNode } from 'react';

export type ButtonStyle = {
  name: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    glow: string;
    border: string;
  };
  animation: {
    hover: string;
    pulse: string;
    icon: string;
  };
  icon: {
    default: ReactNode;
    hover: ReactNode;
  };
};

export type ButtonPosition = {
  position: 'bottom-right' | 'bottom-left';
  offset: {
    x: number;
    y: number;
  };
};

export type ButtonSize = {
  base: number;
  icon: number;
  pulse: number;
};

export interface ChatButtonSettings {
  style: string;
  position: ButtonPosition;
  size: ButtonSize;
  docked: boolean;
} 