import { jsx as _jsx } from "react/jsx-runtime";
import { DocumentsLayout } from "@/components/documents/DocumentsLayout";
const Documents = () => {
    return (_jsx(DocumentsLayout, { children: _jsx("div", { className: "container mx-auto", children: _jsx("h1", { className: "text-2xl font-bold mb-4 gradient-text", children: "Documents" }) }) }));
};
export default Documents;
