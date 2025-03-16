
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface UserTokenCardProps {
  tokenBalance: number;
}

export function UserTokenCard({ tokenBalance }: UserTokenCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Balance</CardTitle>
        <CardDescription>You have {tokenBalance} tokens available</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Contact an administrator to get more tokens.
        </p>
      </CardContent>
    </Card>
  );
}
