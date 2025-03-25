import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProfileSettings() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        if (data) setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      }
    }
    
    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profile.username || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={profile.full_name || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            value={profile.avatar_url || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
            placeholder="Enter avatar URL"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}