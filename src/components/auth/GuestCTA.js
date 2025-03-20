import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Shield, User } from 'lucide-react';
export function GuestCTA() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    if (isAuthenticated)
        return null;
    return (_jsx("div", { className: "fixed bottom-6 right-6 z-50", children: _jsxs(Card, { className: "w-[300px] shadow-lg border-2 border-primary/10", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5 text-primary" }), "Unlock Full Access"] }), _jsx(CardDescription, { children: "Sign up to access all features and functionality" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs(Button, { className: "w-full", onClick: () => navigate('/login'), children: [_jsx(User, { className: "mr-2 h-4 w-4" }), "Sign Up Now"] }) })] }) }));
}
