
import { ChatButtonSettings } from '@/types/chat/button-styles';

export const buttonStyles: Record<string, ChatButtonSettings> = {
  wfpulse: {
    name: "WF Pulse",
    description: "Default cyberpunk animated pulse effect",
    theme: {
      primary: "#0EA5E9",
      secondary: "#8B5CF6",
      accent: "#FF00D0",
      background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
      glow: "0 0 15px rgba(14, 165, 233, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)",
      border: "2px solid rgba(255, 255, 255, 0.1)"
    },
    icon: {
      default: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="10" r="1" fill="currentColor" class="animate-pulse"></circle>
      </svg>`,
      active: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="10" r="2" fill="currentColor"></circle>
      </svg>`
    }
  },
  ooze: {
    name: "Ooze",
    description: "Organic flowing style with bubbling animation",
    theme: {
      primary: "#10B981",
      secondary: "#059669",
      accent: "#ECFDF5",
      background: "linear-gradient(135deg, #10B981, #059669)",
      glow: "0 0 15px rgba(16, 185, 129, 0.6), 0 0 30px rgba(5, 150, 105, 0.3)",
      border: "2px solid rgba(236, 253, 245, 0.2)"
    },
    icon: {
      default: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="10" cy="9" r="1" fill="currentColor" class="animate-bounce"></circle>
        <circle cx="14" cy="10" r="1" fill="currentColor" class="animate-bounce" style="animation-delay: 0.2s"></circle>
        <circle cx="12" cy="12" r="1" fill="currentColor" class="animate-bounce" style="animation-delay: 0.4s"></circle>
      </svg>`,
      active: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="10" cy="9" r="1.5" fill="currentColor"></circle>
        <circle cx="14" cy="10" r="1.5" fill="currentColor"></circle>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
      </svg>`
    }
  },
  flicker: {
    name: "Flicker",
    description: "Retro neon flicker effect",
    theme: {
      primary: "#EC4899",
      secondary: "#F472B6",
      accent: "#FBCFE8",
      background: "linear-gradient(135deg, #EC4899, #F472B6)",
      glow: "0 0 15px rgba(236, 72, 153, 0.6), 0 0 30px rgba(244, 114, 182, 0.3)",
      border: "2px solid rgba(251, 207, 232, 0.2)"
    },
    icon: {
      default: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" class="animate-[flicker_4s_ease-in-out_infinite]"></path>
      </svg>`,
      active: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>`
    }
  },
  terminal: {
    name: "Terminal",
    description: "Command-line inspired",
    theme: {
      primary: "#6EE7B7",
      secondary: "#10B981",
      accent: "#D1FAE5",
      background: "#111827",
      glow: "0 0 10px rgba(110, 231, 183, 0.4)",
      border: "1px solid rgba(110, 231, 183, 0.7)"
    },
    icon: {
      default: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="9" x2="13" y2="13" class="animate-pulse"></line>
        <line x1="13" y1="9" x2="9" y2="13" class="animate-pulse"></line>
      </svg>`,
      active: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="9" x2="13" y2="13"></line>
        <line x1="13" y1="9" x2="9" y2="13"></line>
      </svg>`
    }
  },
  ultra: {
    name: "Ultra",
    description: "Rich visuals with hover effects",
    theme: {
      primary: "#6366F1",
      secondary: "#4F46E5",
      accent: "#C7D2FE",
      background: "linear-gradient(135deg, #6366F1, #4F46E5)",
      glow: "0 0 20px rgba(99, 102, 241, 0.7), 0 0 40px rgba(79, 70, 229, 0.4)",
      border: "2px solid rgba(199, 210, 254, 0.3)"
    },
    icon: {
      default: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="11" r="3" stroke-dasharray="15" stroke-dashoffset="15" class="animate-[dash_2s_linear_infinite]"></circle>
      </svg>`,
      active: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="11" r="3"></circle>
      </svg>`
    }
  }
};
