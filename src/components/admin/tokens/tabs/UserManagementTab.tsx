
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserManagementTabProps {
  isSubmitting: boolean;
  handleUpdateUserTokens: (userId: string, amount: string) => Promise<void>;
}

export function UserManagementTab({ isSubmitting, handleUpdateUserTokens }: UserManagementTabProps) {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('10');

  const handleSubmit = () => {
    if (userId && amount) {
      handleUpdateUserTokens(userId, amount);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-id">User ID</Label>
        <Input 
          id="user-id" 
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="token-amount">Token Amount</Label>
        <Input 
          id="token-amount" 
          type="number"
          min="0"
          placeholder="Enter token amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={!userId || !amount || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>Update User Tokens</>
        )}
      </Button>
    </div>
  );
}
