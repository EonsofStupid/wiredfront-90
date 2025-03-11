
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { useAuthStore } from "@/stores/auth";

export function useEnsureUserProfile() {
  const { user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user) return;
      
      setIsChecking(true);
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
            .insert([{ 
              id: user.id,
              username: user.email,
              avatar_url: user.user_metadata?.avatar_url || null
            }]);
            
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
        logger.error('Profile setup error:', error);
        toast.error('Failed to set up your user profile');
      } finally {
        setIsChecking(false);
      }
    };
    
    const ensureUserRole = async (userId: string) => {
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
      
      // If role doesn't exist, create it (default to 'user' role)
      if (!role) {
        logger.info('Role not found, creating user role');
        
        const { error: insertRoleError } = await supabase
          .from('user_roles')
          .insert([{ 
            user_id: userId,
            role: 'user'
          }]);
          
        if (insertRoleError) {
          logger.error('Error creating role:', insertRoleError);
          throw insertRoleError;
        }
        
        logger.info('User role created successfully');
      }
    };

    checkAndCreateProfile();
  }, [user]);

  return { isChecking, isProfileReady };
}
