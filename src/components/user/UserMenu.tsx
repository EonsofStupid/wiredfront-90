import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenuItems } from "./UserMenuItems";
import { UserMenuTrigger } from "./UserMenuTrigger";
import { useAuthStore } from "@/stores/auth";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div 
      className="relative isolate"
      style={{ 
        zIndex: 'var(--z-dropdown)',
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserMenuTrigger />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="glass-card w-56"
          style={{ 
            position: 'relative',
            zIndex: 'var(--z-dropdown)',
          }}
          sideOffset={8}
          alignOffset={0}
        >
          <UserMenuItems user={user} onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};