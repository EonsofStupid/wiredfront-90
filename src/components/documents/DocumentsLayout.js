import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExtendableTopNav } from "./navigation/ExtendableTopNav";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer";
export const DocumentsLayout = ({ children }) => {
    return (_jsxs(CoreLayoutContainer, { children: [_jsx(ExtendableTopNav, {}), _jsx("main", { className: "pt-16 pb-12 px-4", children: children })] }));
};
