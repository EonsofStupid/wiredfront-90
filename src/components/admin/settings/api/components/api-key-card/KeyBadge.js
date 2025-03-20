import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Github } from "lucide-react";
export function KeyBadge({ type }) {
    switch (type) {
        case 'openai':
            return _jsx("span", { children: "OpenAI" });
        case 'anthropic':
            return _jsx("span", { children: "Anthropic" });
        case 'gemini':
            return _jsx("span", { children: "Google Gemini" });
        case 'pinecone':
            return _jsx("span", { children: "Pinecone" });
        case 'github':
            return (_jsxs(_Fragment, { children: [_jsx(Github, { className: "h-5 w-5 mr-2 text-gray-300" }), " GitHub"] }));
        default:
            return _jsx("span", { children: type });
    }
}
