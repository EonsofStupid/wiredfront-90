import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
export function WelcomeStep({ isFirstTimeUser = false }) {
    return (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: isFirstTimeUser
                            ? "Welcome to wiredFRONT!"
                            : "Welcome to the Setup Wizard!" }), _jsx("p", { className: "text-muted-foreground", children: isFirstTimeUser
                            ? "Let's get you started with your new account. We'll guide you through the initial setup process."
                            : "This wizard will help you configure your application. We'll guide you through:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Setting up your API keys" }), _jsx("li", { children: "Configuring your preferences" }), _jsx("li", { children: "Customizing your experience" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Click \"Next\" to begin the setup process." })] }) }) }));
}
