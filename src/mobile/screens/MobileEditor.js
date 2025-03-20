import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
/**
 * Mobile-optimized editor experience
 */
export const MobileEditor = () => {
    return (_jsx("div", { className: "space-y-4", children: _jsxs(Tabs, { defaultValue: "code", className: "w-full", children: [_jsxs(TabsList, { className: "w-full bg-dark-lighter border border-neon-blue/20", children: [_jsx(TabsTrigger, { value: "code", className: "flex-1", children: "Code" }), _jsx(TabsTrigger, { value: "preview", className: "flex-1", children: "Preview" }), _jsx(TabsTrigger, { value: "output", className: "flex-1", children: "Output" })] }), _jsx(TabsContent, { value: "code", className: "mt-4", children: _jsx("div", { className: "p-4 rounded-lg bg-dark-lighter border border-neon-blue/20", children: _jsx("pre", { className: "text-xs font-mono text-white overflow-x-auto", children: _jsx("code", { children: `// Example code
import React from "react";

export const HelloWorld = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Hello, Mobile!
      </h1>
    </div>
  );
};` }) }) }) }), _jsx(TabsContent, { value: "preview", className: "mt-4", children: _jsx("div", { className: "p-4 rounded-lg bg-dark-lighter border border-neon-blue/20", children: _jsx("div", { className: "p-4 bg-black/30 rounded", children: _jsx("h1", { className: "text-xl font-bold", children: "Hello, Mobile!" }) }) }) }), _jsx(TabsContent, { value: "output", className: "mt-4", children: _jsx("div", { className: "p-4 rounded-lg bg-dark-lighter border border-neon-blue/20", children: _jsx("div", { className: "font-mono text-xs text-green-400", children: "\u2713 Compiled successfully!" }) }) })] }) }));
};
