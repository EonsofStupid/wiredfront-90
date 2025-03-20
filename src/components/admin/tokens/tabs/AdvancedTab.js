import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
export function AdvancedTab({ tokenBalance, enforcementMode, addTokens, handleUpdateEnforcementConfig, isSubmitting }) {
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "self-tokens", children: "Your Token Balance" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { id: "self-tokens", type: "number", value: tokenBalance.toString(), readOnly: true }), _jsx(Button, { variant: "outline", onClick: () => addTokens(100), disabled: isSubmitting, children: "Add 100" })] })] }), _jsxs("div", { className: "flex items-center justify-between space-x-2 rounded-lg border p-4", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { children: "System Test Mode" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "When enabled, tokens will not be spent in development" })] }), _jsx(Switch, { checked: enforcementMode === 'never', onCheckedChange: (checked) => handleUpdateEnforcementConfig(checked ? 'never' : 'always'), disabled: isSubmitting })] })] }));
}
