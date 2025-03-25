
/**
 * Theme types for styling management
 */

// Theme variables with default cyber styling
export interface ThemeVariables {
  // Colors
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
  
  // Dimensions
  chatWidth: string;
  chatHeight: string;
  borderRadius: string;
  
  // Z-index management
  zLayer: number;
  
  // Effects
  glowEffect: string;
  animationSpeed: string;
  
  // UI features
  glassMorphism: boolean;
  neonEffects: boolean;
  animations: boolean;
}

export interface ThemeCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ThemeToken {
  id: string;
  theme_id: string;
  category_id: string;
  token_name: string;
  token_value: string;
  description?: string;
  is_css_var: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
  tokens?: ThemeToken[];
  categories?: ThemeCategory[];
}
