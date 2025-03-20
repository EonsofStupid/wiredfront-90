import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export function useAPIKeyCardActions({ config, onRefresh }) {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const handleToggleEnabled = async () => {
        setUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('api_configurations')
                .update({ is_enabled: !config.is_enabled })
                .eq('id', config.id);
            if (error)
                throw error;
            toast.success(`API key ${!config.is_enabled ? 'enabled' : 'disabled'}`);
            onRefresh();
        }
        catch (error) {
            console.error('Error updating API configuration:', error);
            toast.error("Failed to update API configuration");
        }
        finally {
            setUpdatingStatus(false);
        }
    };
    const handleSetDefault = async () => {
        if (config.is_default)
            return; // Already default
        setUpdatingStatus(true);
        try {
            // First, unset any existing defaults for this API type
            const { error: updateError1 } = await supabase
                .from('api_configurations')
                .update({ is_default: false })
                .eq('api_type', config.api_type)
                .eq('is_default', true);
            if (updateError1)
                throw updateError1;
            // Then set this one as default
            const { error: updateError2 } = await supabase
                .from('api_configurations')
                .update({ is_default: true })
                .eq('id', config.id);
            if (updateError2)
                throw updateError2;
            toast.success(`Set as default ${config.api_type} configuration`);
            onRefresh();
        }
        catch (error) {
            console.error('Error setting default API configuration:', error);
            toast.error("Failed to set default configuration");
        }
        finally {
            setUpdatingStatus(false);
        }
    };
    return {
        updatingStatus,
        handleToggleEnabled,
        handleSetDefault
    };
}
