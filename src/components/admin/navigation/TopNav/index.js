import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { MainNavGroup } from "./components/MainNavGroup";
import { UtilityNavGroup } from "./components/UtilityNavGroup";
import { NavHandle } from "./components/NavHandle";
import { useTopNavLayout } from "./hooks/useTopNavLayout";
import styles from "./styles.module.css";
export const AdminTopNav = ({ className }) => {
    const { isExtended, iconOnly, toggleExtended } = useTopNavLayout();
    return (_jsx("div", { className: cn(styles.topNav, isExtended ? styles.extended : styles.collapsed, className), children: _jsxs("div", { className: styles.navPanel, children: [_jsxs("div", { className: styles.navContent, children: [_jsx(MainNavGroup, { isCollapsed: iconOnly }), _jsx(UtilityNavGroup, {})] }), _jsx(NavHandle, { isExtended: isExtended, onToggle: toggleExtended })] }) }));
};
