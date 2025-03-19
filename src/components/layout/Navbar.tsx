
import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, signOut } = useSupabaseAuth();

  return (
    <nav className="bg-background border-b py-3">
      <div className="container flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-xl font-bold">
            WiredFront
          </Link>
          
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/chat" className="text-sm font-medium hover:text-primary">
              Chat
            </Link>
            {user && (
              <Link href="/projects" className="text-sm font-medium hover:text-primary">
                Projects
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
