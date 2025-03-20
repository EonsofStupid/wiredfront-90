import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useFeatureFlags } from '@/hooks/admin/settings/useFeatureFlags';
import { FeatureFlagDialog } from './FeatureFlagDialog';
import { FeatureFlagHeader, FeatureFlagSearch, FeatureFlagSkeleton, FeatureFlagEmptyState, FeatureFlagList, DeleteConfirmDialog } from './components';
export default function FeatureFlags() {
    const { featureFlags, isLoading, toggleFeatureFlag, createFeatureFlag, updateFeatureFlag, deleteFeatureFlag, isSuperAdmin } = useFeatureFlags();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFlag, setSelectedFlag] = useState(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const filteredFlags = featureFlags?.filter(flag => flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleCreateFlag = (values) => {
        createFeatureFlag.mutate(values);
    };
    const handleUpdateFlag = (values) => {
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
    const handleToggleStatus = (flag) => {
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
    const openEditDialog = (flag) => {
        setSelectedFlag(flag);
        setIsCreating(false);
        setIsDialogOpen(true);
    };
    const confirmDelete = () => {
        setDeleteConfirmOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(FeatureFlagHeader, { onCreateFlag: openCreateDialog, isSuperAdmin: isSuperAdmin }), _jsx(FeatureFlagSearch, { searchQuery: searchQuery, onSearchChange: setSearchQuery }), isLoading ? (_jsx(FeatureFlagSkeleton, {})) : filteredFlags?.length === 0 ? (_jsx(FeatureFlagEmptyState, { onCreateFlag: openCreateDialog, isSuperAdmin: isSuperAdmin, searchQuery: searchQuery })) : (_jsx(FeatureFlagList, { flags: filteredFlags || [], onToggle: handleToggleStatus, onEdit: openEditDialog })), _jsx(FeatureFlagDialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, flag: selectedFlag, onSubmit: isCreating ? handleCreateFlag : handleUpdateFlag, onDelete: confirmDelete, isCreating: isCreating, isSuperAdmin: isSuperAdmin }), _jsx(DeleteConfirmDialog, { open: deleteConfirmOpen, onOpenChange: setDeleteConfirmOpen, onDelete: handleDeleteFlag, flagName: selectedFlag?.name })] }));
}
