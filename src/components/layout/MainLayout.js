import { jsx as _jsx } from "react/jsx-runtime";
import { CoreLayout } from "@/core/layout/CoreLayout";
/**
 * @name MainLayout
 * @description A wrapper around CoreLayout to maintain backward compatibility
 */
export const MainLayout = ({ children }) => {
    return _jsx(CoreLayout, { children: children });
};
