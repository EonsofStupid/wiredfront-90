
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, Trash } from 'lucide-react';
import { FeatureFlag, FeatureFlagFormValues } from '@/types/admin/settings/feature-flags';
import { Database } from '@/integrations/supabase/types';

// Schema for form validation
const formSchema = z.object({
  key: z.string().min(3, { message: 'Key must be at least 3 characters' }).max(50).regex(/^[a-z0-9_]+$/, {
    message: 'Key can only contain lowercase letters, numbers, and underscores',
  }),
  name: z.string().min(3, { message: 'Name is required' }).max(100),
  description: z.string().max(500).optional(),
  enabled: z.boolean().default(false),
  target_roles: z.array(z.string()).optional(),
  rollout_percentage: z.number().min(0).max(100).default(100),
});

type FeatureFlagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flag?: FeatureFlag;
  onSubmit: (values: FeatureFlagFormValues) => void;
  onDelete?: () => void;
  isCreating?: boolean;
  isSuperAdmin: boolean;
};

const roleOptions: Database["public"]["Enums"]["app_role"][] = ['super_admin', 'admin', 'developer', 'subscriber', 'guest'];

export function FeatureFlagDialog({ 
  open, 
  onOpenChange, 
  flag, 
  onSubmit, 
  onDelete, 
  isCreating = false,
  isSuperAdmin
}: FeatureFlagDialogProps) {
  const form = useForm<FeatureFlagFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: flag?.key || '',
      name: flag?.name || '',
      description: flag?.description || '',
      enabled: flag?.enabled || false,
      target_roles: flag?.target_roles || [],
      rollout_percentage: flag?.rollout_percentage || 100,
    },
  });

  const handleSubmit = (values: FeatureFlagFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isCreating ? 'Create Feature Flag' : 'Edit Feature Flag'}</DialogTitle>
          <DialogDescription>
            {isCreating 
              ? 'Add a new feature flag to control feature availability within the application.'
              : 'Modify existing feature flag settings and targeting.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="example_feature" 
                        {...field} 
                        readOnly={!isCreating}
                        className={!isCreating ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier used in code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example Feature" {...field} />
                    </FormControl>
                    <FormDescription>
                      Human-readable name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this feature flag controls..." 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                      Toggle this feature on or off
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rollout_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rollout Percentage: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of users who will have this feature enabled
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Roles</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roleOptions.map(role => {
                      const isSelected = field.value?.includes(role);
                      return (
                        <Badge
                          key={role}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer ${isSelected ? 'bg-primary' : ''}`}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value?.filter(r => r !== role)
                              : [...(field.value || []), role];
                            field.onChange(newValue);
                          }}
                        >
                          {isSelected && <CheckIcon className="mr-1 h-3 w-3" />}
                          {role.replace('_', ' ')}
                        </Badge>
                      );
                    })}
                  </div>
                  <FormDescription>
                    Leave empty to target all roles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2 justify-between">
              {!isCreating && isSuperAdmin && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={onDelete}
                  className="mr-auto"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <div>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit">
                  {isCreating ? 'Create' : 'Save changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
