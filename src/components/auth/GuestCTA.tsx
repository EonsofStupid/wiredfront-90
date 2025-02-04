import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, User } from 'lucide-react';

export function GuestCTA() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-[300px] shadow-lg border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Unlock Full Access
          </CardTitle>
          <CardDescription>
            Sign up to access all features and functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/login')}
          >
            <User className="mr-2 h-4 w-4" />
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}