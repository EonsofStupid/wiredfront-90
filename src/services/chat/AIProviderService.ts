
import { supabase } from '@/integrations/supabase/client';
import { Provider, ProviderType, stringToProviderType, AvailableProviderRecord } from '@/components/chat/types/provider-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch available providers from the database
 */
export const getAvailableProviders = async (): Promise<Provider[]> => {
  try {
    const { data, error } = await supabase
      .from('available_providers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    // Map database records to Provider interface
    const providers: Provider[] = data.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      type: stringToProviderType(provider.provider_type),
      isDefault: provider.is_default || false,
      isEnabled: provider.is_enabled,
      category: provider.provider_type === 'image' ? 'image' : 
               provider.provider_type === 'integration' ? 'integration' : 'chat',
      description: provider.display_name || provider.name,
      models: []
    }));
    
    return providers;
  } catch (error) {
    console.error('Failed to fetch available providers:', error);
    return [];
  }
};

/**
 * Get provider by ID
 */
export const getProviderById = async (id: string): Promise<Provider | null> => {
  try {
    const { data, error } = await supabase
      .from('available_providers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      type: stringToProviderType(data.provider_type),
      isDefault: data.is_default || false,
      isEnabled: data.is_enabled,
      category: data.provider_type === 'image' ? 'image' : 
               data.provider_type === 'integration' ? 'integration' : 'chat',
      description: data.display_name || data.name,
      models: []
    };
  } catch (error) {
    console.error(`Failed to fetch provider with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new provider
 */
export const createProvider = async (provider: Partial<AvailableProviderRecord>): Promise<string | null> => {
  try {
    const providerData = {
      ...provider,
      id: provider.id || uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('available_providers')
      .insert(providerData);
    
    if (error) throw error;
    
    return providerData.id;
  } catch (error) {
    console.error('Failed to create provider:', error);
    return null;
  }
};

/**
 * Update an existing provider
 */
export const updateProvider = async (id: string, updates: Partial<AvailableProviderRecord>): Promise<boolean> => {
  try {
    const providerUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('available_providers')
      .update(providerUpdates)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Failed to update provider with ID ${id}:`, error);
    return false;
  }
};

/**
 * Delete a provider
 */
export const deleteProvider = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('available_providers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Failed to delete provider with ID ${id}:`, error);
    return false;
  }
};

/**
 * Set a provider as default
 */
export const setDefaultProvider = async (id: string): Promise<boolean> => {
  try {
    // First, unset current default provider
    await supabase
      .from('available_providers')
      .update({ is_default: false })
      .neq('id', id);
    
    // Then set the new default provider
    const { error } = await supabase
      .from('available_providers')
      .update({ is_default: true })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Failed to set provider ${id} as default:`, error);
    return false;
  }
};

// Export all functions as a service object
export const AIProviderService = {
  getAvailableProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  setDefaultProvider
};
