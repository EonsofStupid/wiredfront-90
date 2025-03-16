
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FeatureFlag } from '@/types/admin/settings/feature-flags';

interface FeatureFlagCardProps {
  flag: FeatureFlag;
  onToggle: (flag: FeatureFlag) => void;
  onEdit: (flag: FeatureFlag) => void;
}

export function FeatureFlagCard({ flag, onToggle, onEdit }: FeatureFlagCardProps) {
  return (
    <Card key={flag.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{flag.name}</CardTitle>
            <CardDescription className="font-mono text-xs">{flag.key}</CardDescription>
          </div>
          <Switch
            checked={flag.enabled}
            onCheckedChange={() => onToggle(flag)}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {flag.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{flag.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}
        
        {flag.target_roles && flag.target_roles.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Target roles:</p>
            <div className="flex flex-wrap gap-1">
              {flag.target_roles.map(role => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {flag.rollout_percentage < 100 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">Rollout: {flag.rollout_percentage}%</p>
            <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full" 
                style={{ width: `${flag.rollout_percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(flag)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
