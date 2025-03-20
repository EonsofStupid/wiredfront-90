import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Upload, Grid, List, Search } from 'lucide-react';
import { useDocumentStore } from '@/stores/documents/store';
import { Input } from '@/components/ui/input';
export const DocumentHeader = () => {
    const { view, setView, filters, setFilters } = useDocumentStore();
    return (_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsx("div", { className: "flex items-center gap-4 flex-1", children: _jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }), _jsx(Input, { placeholder: "Search documents...", className: "pl-10", value: filters.search, onChange: (e) => setFilters({ search: e.target.value }) })] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setView('grid'), className: view === 'grid' ? 'bg-muted' : '', children: _jsx(Grid, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setView('list'), className: view === 'list' ? 'bg-muted' : '', children: _jsx(List, { className: "h-4 w-4" }) }), _jsxs(Button, { children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Upload"] })] })] }));
};
