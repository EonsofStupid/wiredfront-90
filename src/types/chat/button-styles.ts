
export interface ButtonTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glow: string;
  border: string;
}

export interface ButtonIcon {
  default: string;
  active: string;
}

export interface ChatButtonSettings {
  name: string;
  description: string;
  theme: ButtonTheme;
  icon: ButtonIcon;
}
