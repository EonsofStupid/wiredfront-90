import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export function useMetrics() {
    const fetchMetrics = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('metrics')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error fetching metrics:', error);
            toast.error('Failed to load metrics');
            return [];
        }
    }, []);
    const createMetric = useCallback(async (metric) => {
        try {
            const { data, error } = await supabase
                .from('metrics')
                .insert(metric)
                .select()
                .single();
            if (error)
                throw error;
            toast.success('Metric created successfully');
            return data;
        }
        catch (error) {
            console.error('Error creating metric:', error);
            toast.error('Failed to create metric');
            throw error;
        }
    }, []);
    const updateMetric = useCallback(async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('metrics')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            toast.success('Metric updated successfully');
            return data;
        }
        catch (error) {
            console.error('Error updating metric:', error);
            toast.error('Failed to update metric');
            throw error;
        }
    }, []);
    const deleteMetric = useCallback(async (id) => {
        try {
            const { error } = await supabase
                .from('metrics')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            toast.success('Metric deleted successfully');
        }
        catch (error) {
            console.error('Error deleting metric:', error);
            toast.error('Failed to delete metric');
            throw error;
        }
    }, []);
    return {
        fetchMetrics,
        createMetric,
        updateMetric,
        deleteMetric
    };
}
