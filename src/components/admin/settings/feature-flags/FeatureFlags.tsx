
import React, { useState } from 'react';
import { useFeatureFlags } from '@/hooks/admin/settings/useFeatureFlags';
import { FeatureFlag, FeatureFlagFormValues, AppRole } from '@/types/admin/settings/feature-flags';
import { FeatureFlagDialog } from './FeatureFlagDialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Filter, Info, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FeatureFlags() {
  const { 
    featureFlags, 
    isLoading, 
    toggleFeatureFlag, 
    createFeatureFlag, 
    updateFeatureFlag,
    deleteFeatureFlag,
    isSuperAdmin
  } = useFeatureFlags();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const filteredFlags = featureFlags?.filter(flag => 
    flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFlag = (values: FeatureFlagFormValues) => {
    createFeatureFlag.mutate(values);
  };

  const handleUpdateFlag = (values: FeatureFlagFormValues) => {
    if (selectedFlag) {
      updateFeatureFlag.mutate({
        ...selectedFlag,
        ...values
      });
    }
  };

  const handleDeleteFlag = () => {
    if (selectedFlag) {
      deleteFeatureFlag.mutate(selectedFlag.id);
      setDeleteConfirmOpen(false);
      setIsDialogOpen(false);
    }
  };

  const handleToggleStatus = (flag: FeatureFlag) => {
    toggleFeatureFlag.mutate({ 
      id: flag.id, 
      enabled: !flag.enabled 
    });
  };

  const openCreateDialog = () => {
    setSelectedFlag(undefined);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
    setIsCreating(false);
    setIsDialogOpen(true);
  };
  
  const confirmDelete = () => {
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Feature Flags</h2>
          <p className="text-muted-foreground">Manage feature availability across the application.</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New Feature Flag
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search feature flags..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-8 bg-muted rounded w-full mt-2"></div>
              </CardContent>
              <CardFooter>
                <div className="h-5 bg-muted rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredFlags?.length === 0 ? (
        <Card className="bg-background border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Info className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">No feature flags found</p>
            <p className="text-muted-foreground text-center mt-1">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first feature flag to get started"}
            </p>
            {isSuperAdmin && !searchQuery && (
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Feature Flag
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredFlags?.map((flag) => (
              <Card key={flag.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{flag.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">{flag.key}</CardDescription>
                    </div>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => handleToggleStatus(flag)}
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
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(flag)}>
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <FeatureFlagDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        flag={selectedFlag}
        onSubmit={isCreating ? handleCreateFlag : handleUpdateFlag}
        onDelete={confirmDelete}
        isCreating={isCreating}
        isSuperAdmin={isSuperAdmin}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the feature flag "{selectedFlag?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFlag} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
