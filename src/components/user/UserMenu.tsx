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
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="relative" style={{ zIndex: 'var(--z-dropdown)' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserMenuTrigger aria-label="User menu" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="glass-card"
          style={{ position: 'relative', zIndex: 'var(--z-dropdown)' }}
        >
          <UserMenuItems user={user} onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};