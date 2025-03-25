import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeatureFlag, FeatureFlagFormValues } from "@/types/admin/settings/feature-flags";
import { useRoleStore } from "@/stores/role";

export const useFeatureFlags = () => {
  const { hasRole } = useRoleStore();
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  const isSuperAdmin = hasRole('super_admin');
  const queryClient = useQueryClient();
  
  // Fetch all feature flags
  const { data: featureFlags, isLoading, error } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Return the data directly, as FeatureFlag type already accounts for updated_by
      return data as FeatureFlag[];
    },
    enabled: isAdmin
  });

  // Toggle a feature flag
  const toggleFeatureFlag = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { data, error } = await supabase
        .from('feature_flags')
        .update({ enabled, updated_by: (await supabase.auth.getUser()).data.user?.id })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag updated successfully');
    },
    onError: (error) => {
      console.error('Error toggling feature flag:', error);
      toast.error('Failed to update feature flag');
    }
  });

  // Create a new feature flag
  const createFeatureFlag = useMutation({
    mutationFn: async (formValues: FeatureFlagFormValues) => {
      const newFlag = {
        ...formValues,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      };

      const { data, error } = await supabase
        .from('feature_flags')
        .insert(newFlag)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating feature flag:', error);
      
      // Handle unique key constraint violation
      if (error.code === '23505') {
        toast.error('A feature flag with this key already exists');
      } else {
        toast.error('Failed to create feature flag');
      }
    }
  });

  // Update an existing feature flag
  const updateFeatureFlag = useMutation({
    mutationFn: async (flag: FeatureFlag) => {
      const { data, error } = await supabase
        .from('feature_flags')
        .update({ 
          ...flag,
          updated_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', flag.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feature flag:', error);
      toast.error('Failed to update feature flag');
    }
  });

  // Delete a feature flag
  const deleteFeatureFlag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast.success('Feature flag deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting feature flag:', error);
      toast.error('Failed to delete feature flag');
    }
  });

  return {
    featureFlags,
    isLoading,
    error,
    toggleFeatureFlag,
    createFeatureFlag,
    updateFeatureFlag,
    deleteFeatureFlag,
    isAdmin,
    isSuperAdmin
  };
};
