import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export function UserManagementTab({ isSubmitting, onUpdateUserTokens }) {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('10');
    const handleSubmit = () => {
        if (userId && amount) {
            onUpdateUserTokens(userId, amount);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "user-id", children: "User ID" }), _jsx(Input, { id: "user-id", placeholder: "Enter user ID", value: userId, onChange: (e) => setUserId(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "token-amount", children: "Token Amount" }), _jsx(Input, { id: "token-amount", type: "number", min: "0", placeholder: "Enter token amount", value: amount, onChange: (e) => setAmount(e.target.value) })] }), _jsx(Button, { onClick: handleSubmit, disabled: !userId || !amount || isSubmitting, className: "w-full", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Updating..."] })) : (_jsx(_Fragment, { children: "Update User Tokens" })) })] }));
}
