import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Server } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
export function DockerSettings({ dockerToken, onDockerTokenChange }) {
    const [newDockerToken, setNewDockerToken] = useState("");
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Server, { className: "h-5 w-5" }), "Docker Registry"] }), _jsx(CardDescription, { children: "Connect to Docker registry for container operations" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { type: "password", placeholder: "Enter your Docker registry token", value: newDockerToken, onChange: (e) => setNewDockerToken(e.target.value) }), _jsxs("p", { className: "text-xs flex items-center text-muted-foreground", children: [_jsx(Info, { className: "h-3 w-3 mr-1" }), "Used for pushing and pulling containers to Docker registries"] })] }) }), _jsx(CardFooter, { children: _jsxs(Button, { onClick: () => {
                        onDockerTokenChange(newDockerToken);
                        setNewDockerToken("");
                        toast.success("Docker token saved");
                    }, className: "w-full", disabled: !newDockerToken, children: [_jsx(Server, { className: "h-4 w-4 mr-2" }), "Save Docker Token"] }) })] }));
}
