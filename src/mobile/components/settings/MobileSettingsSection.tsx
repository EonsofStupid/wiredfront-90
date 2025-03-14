
import React, { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp, User, Github, Palette, Webhook, Server, AlertTriangle } from "lucide-react";

type IconName = "user" | "github" | "palette" | "webhook" | "server" | "warning";

interface MobileSettingsSectionProps {
  title: string;
  description?: string;
  icon?: IconName;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const MobileSettingsSection = ({
  title,
  description,
  icon,
  children,
  defaultOpen = false
}: MobileSettingsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const getIcon = (name: IconName) => {
    switch (name) {
      case "user":
        return <User className="h-5 w-5" />;
      case "github":
        return <Github className="h-5 w-5" />;
      case "palette":
        return <Palette className="h-5 w-5" />;
      case "webhook":
        return <Webhook className="h-5 w-5" />;
      case "server":
        return <Server className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="border border-neon-blue/20 rounded-lg overflow-hidden bg-dark-lighter/10">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-lighter/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-neon-blue">
              {getIcon(icon)}
            </div>
          )}
          <div>
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="border-t border-neon-blue/10 animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
