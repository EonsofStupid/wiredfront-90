import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { useRoleStore } from "@/stores/role";
export function useAPIConfigurations() {
    const [configurations, setConfigurations] = useState([]);
    const [loading, setLoading] = useState(false);
    const { roles } = useRoleStore();
    const isSuperAdmin = roles.includes('super_admin');
    const fetchConfigurations = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('api_configurations')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setConfigurations(data);
        }
        catch (error) {
            console.error('Error fetching configurations:', error);
            toast.error('Failed to load API configurations');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const createConfiguration = useCallback(async (type, memorable_name) => {
        if (!isSuperAdmin) {
            toast.error('Only super admins can create configurations');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('api_configurations')
                .insert({
                api_type: type,
                memorable_name,
                is_enabled: true,
                validation_status: 'pending'
            })
                .select()
                .single();
            if (error)
                throw error;
            setConfigurations(prev => [...prev, data]);
            toast.success('API configuration created successfully');
            return data;
        }
        catch (error) {
            console.error('Error creating configuration:', error);
            toast.error('Failed to create API configuration');
            throw error;
        }
    }, [isSuperAdmin]);
    const updateConfiguration = useCallback(async (id, updates) => {
        if (!isSuperAdmin) {
            toast.error('Only super admins can update configurations');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('api_configurations')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            setConfigurations(prev => prev.map(config => config.id === id ? { ...config, ...data } : config));
            toast.success('API configuration updated successfully');
            return data;
        }
        catch (error) {
            console.error('Error updating configuration:', error);
            toast.error('Failed to update API configuration');
            throw error;
        }
    }, [isSuperAdmin]);
    const deleteConfiguration = useCallback(async (id) => {
        if (!isSuperAdmin) {
            toast.error('Only super admins can delete configurations');
            return;
        }
        try {
            const { error } = await supabase
                .from('api_configurations')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setConfigurations(prev => prev.filter(config => config.id !== id));
            toast.success('API configuration deleted successfully');
        }
        catch (error) {
            console.error('Error deleting configuration:', error);
            toast.error('Failed to delete API configuration');
            throw error;
        }
    }, [isSuperAdmin]);
    return {
        configurations,
        loading,
        fetchConfigurations,
        createConfiguration,
        updateConfiguration,
        deleteConfiguration,
        isSuperAdmin
    };
}
