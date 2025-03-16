
import React, { useState } from 'react';
import { useFeatureFlags } from '@/hooks/admin/settings/useFeatureFlags';
import { FeatureFlag } from '@/types/admin/settings/feature-flags';
import { FeatureFlagDialog } from './FeatureFlagDialog';
import {
  FeatureFlagHeader,
  FeatureFlagSearch,
  FeatureFlagSkeleton,
  FeatureFlagEmptyState,
  FeatureFlagList,
  DeleteConfirmDialog
} from './components';

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

  const handleCreateFlag = (values: any) => {
    createFeatureFlag.mutate(values);
  };

  const handleUpdateFlag = (values: any) => {
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
      <FeatureFlagHeader 
        onCreateFlag={openCreateDialog}
        isSuperAdmin={isSuperAdmin}
      />

      <FeatureFlagSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <FeatureFlagSkeleton />
      ) : filteredFlags?.length === 0 ? (
        <FeatureFlagEmptyState 
          onCreateFlag={openCreateDialog}
          isSuperAdmin={isSuperAdmin}
          searchQuery={searchQuery}
        />
      ) : (
        <FeatureFlagList 
          flags={filteredFlags || []}
          onToggle={handleToggleStatus}
          onEdit={openEditDialog}
        />
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

      <DeleteConfirmDialog 
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onDelete={handleDeleteFlag}
        flagName={selectedFlag?.name}
      />
    </div>
  );
}
