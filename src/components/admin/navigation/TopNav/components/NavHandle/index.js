import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "./styles.module.css";
export const NavHandle = ({ isExtended, onToggle }) => {
    return (_jsx(Button, { variant: "ghost", size: "sm", onClick: onToggle, className: styles.navHandle, "aria-label": isExtended ? "Collapse navigation" : "Expand navigation", children: isExtended ? (_jsx(ChevronUp, { className: "h-4 w-4" })) : (_jsx(ChevronDown, { className: "h-4 w-4" })) }));
};
