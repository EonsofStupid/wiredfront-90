import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            if (!user?.id)
                return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (error)
                    throw error;
                if (data)
                    setProfile(data);
            }
            catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Failed to load profile');
            }
        }
        loadProfile();
    }, [user?.id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id)
            return;
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
            if (error)
                throw error;
            toast.success('Profile updated successfully');
        }
        catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: "Username" }), _jsx(Input, { id: "username", value: profile.username || '', onChange: (e) => setProfile(prev => ({ ...prev, username: e.target.value })), placeholder: "Enter username" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Full Name" }), _jsx(Input, { id: "fullName", value: profile.full_name || '', onChange: (e) => setProfile(prev => ({ ...prev, full_name: e.target.value })), placeholder: "Enter full name" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "avatarUrl", children: "Avatar URL" }), _jsx(Input, { id: "avatarUrl", value: profile.avatar_url || '', onChange: (e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value })), placeholder: "Enter avatar URL" })] })] }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? 'Saving...' : 'Save Changes' })] }));
}
