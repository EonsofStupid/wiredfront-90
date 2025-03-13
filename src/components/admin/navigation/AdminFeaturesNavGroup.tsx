
import { Button } from "@/components/ui/button";
import { 
  Database, 
  Github,
  KeyRound, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  UserCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminFeaturesNavGroup() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const buttonVariant = (path: string) => {
    return isActive(path) ? "secondary" : "ghost";
  };

  return (
    <div className="space-y-1">
      <Button
        variant={buttonVariant("/admin")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin")}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Dashboard
      </Button>
      
      <Button
        variant={buttonVariant("/admin/settings")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/settings")}
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      
      <Button
        variant={buttonVariant("/admin/users")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/users")}
      >
        <UserCircle className="h-4 w-4 mr-2" />
        Users
      </Button>
      
      <Button
        variant={buttonVariant("/admin/api-keys")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/api-keys")}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        API Keys
      </Button>
      
      <Button
        variant={buttonVariant("/admin/chat-settings")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/chat-settings")}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat Settings
      </Button>
      
      <Button
        variant={buttonVariant("/admin/database")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/database")}
      >
        <Database className="h-4 w-4 mr-2" />
        Database
      </Button>
      
      <Button
        variant={buttonVariant("/admin/github-connections")}
        size="sm"
        className="w-full justify-start"
        onClick={() => navigate("/admin/github-connections")}
      >
        <Github className="h-4 w-4 mr-2" />
        GitHub Connections
      </Button>
    </div>
  );
}
