import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
export function UserTokenCard({ tokenBalance }) {
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Token Balance" }), _jsxs(CardDescription, { children: ["You have ", tokenBalance, " tokens available"] })] }), _jsx(CardContent, { children: _jsx("p", { className: "text-muted-foreground", children: "Contact an administrator to get more tokens." }) })] }));
}
