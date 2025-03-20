import { jsx as _jsx } from "react/jsx-runtime";
import { AdminTopNav } from "./TopNav";
import "./adminNav.css";
export const AdminTopNavOverlay = () => {
    return (_jsx("div", { className: "wf-admin-nav-container", children: _jsx(AdminTopNav, { className: "wf-admin-nav" }) }));
};
