import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function AIServicesSection({ title, description, apiKey, onApiKeyChange, placeholder, docsUrl, docsText, }) {
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: title }), _jsx(CardDescription, { children: description })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: `${title.toLowerCase()}-key`, children: "API Key" }), _jsx(Input, { id: `${title.toLowerCase()}-key`, type: "password", value: apiKey, onChange: (e) => onApiKeyChange(e.target.value), placeholder: placeholder })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Get your API key from the", " ", _jsx("a", { href: docsUrl, target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:underline", children: docsText })] })] })] }));
}
