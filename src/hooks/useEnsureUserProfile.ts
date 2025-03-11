
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { useAuthStore } from "@/stores/auth";

// Valid app roles based on the database enum type
type AppRole = "super_admin" | "admin" | "developer" | "subscriber" | "guest";

export function useEnsureUserProfile() {
  const { user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user) return;
      
      setIsChecking(true);
      setError(null);
      
      try {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is the error code for "not found"
          logger.error('Error checking profile:', profileError);
          throw profileError;
        }
        
        // If profile doesn't exist, create it
        if (!profile) {
          logger.info('Profile not found, creating new profile');
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email,
              avatar_url: user.user_metadata?.avatar_url || null
            });
            
          if (insertError) {
            logger.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          // Also create a user role if needed
          await ensureUserRole(user.id);
          
          logger.info('Profile created successfully');
          toast.success('Your profile has been set up');
        } else {
          logger.info('Profile already exists');
          await ensureUserRole(user.id);
        }
        
        setIsProfileReady(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error('Profile setup error:', error);
        toast.error(`Failed to set up your user profile: ${errorMessage}`);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsChecking(false);
      }
    };
    
    const ensureUserRole = async (userId: string) => {
      try {
        // Check if role exists
        const { data: role, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (roleError) {
          logger.error('Error checking user role:', roleError);
          throw roleError;
        }
        
        // If role doesn't exist, create it (default to 'subscriber' role which is valid in the enum)
        if (!role) {
          logger.info('Role not found, creating subscriber role');
          
          // Ensure we're using a valid role type from the enum
          const defaultRole: AppRole = 'subscriber';
          
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({ 
              user_id: userId,
              role: defaultRole
            });
            
          if (insertRoleError) {
            logger.error('Error creating role:', insertRoleError);
            throw insertRoleError;
          }
          
          logger.info('User role created successfully');
        } else {
          logger.info(`User has role: ${role.role}`);
        }
      } catch (error) {
        logger.error('Error in ensureUserRole:', error);
        throw error; // Re-throw to be handled by the parent function
      }
    };

    checkAndCreateProfile();
  }, [user]);

  return { isChecking, isProfileReady, error };
}
