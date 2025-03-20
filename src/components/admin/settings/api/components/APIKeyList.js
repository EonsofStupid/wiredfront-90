import { jsx as _jsx } from "react/jsx-runtime";
import { APIKeyCard } from "./api-key-card/APIKeyCard";
export function APIKeyList({ configurations, onValidate, onDelete, onRefresh }) {
    return (_jsx("div", { className: "grid gap-6", children: configurations.map((config) => (_jsx(APIKeyCard, { config: config, onValidate: onValidate, onDelete: onDelete, onRefresh: onRefresh }, config.id))) }));
}
