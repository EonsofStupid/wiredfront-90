import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, X } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';
export function KnowledgeSourceDialog() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim())
            return;
        setIsSearching(true);
        logger.info('Searching knowledge sources', { query: searchQuery });
        try {
            // This would be replaced with a real API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSearchResults([
                { id: 1, title: 'Example Result 1', excerpt: 'This is a sample search result.' },
                { id: 2, title: 'Example Result 2', excerpt: 'Another example of what search results might look like.' },
            ]);
        }
        catch (error) {
            logger.error('Error searching knowledge sources', { error });
        }
        finally {
            setIsSearching(false);
        }
    };
    return (_jsxs(DialogContent, { className: "chat-dialog-content sm:max-w-[500px]", onEscapeKeyDown: () => logger.info('Dialog closed with escape key'), children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-chat-knowledge-text", children: [_jsx(BookOpen, { className: "h-5 w-5" }), "Knowledge Sources"] }), _jsx(DialogDescription, { children: "Search through connected knowledge bases to enhance your AI responses" })] }), _jsxs("form", { onSubmit: handleSearch, className: "mt-2", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search knowledge base...", className: "chat-input pl-10 bg-chat-input-bg text-chat-input-text chat-cyber-border" })] }), _jsx("div", { className: "mt-4 space-y-2", children: isSearching ? (_jsx("div", { className: "flex justify-center py-6", children: _jsx("div", { className: "animate-spin h-6 w-6 border-2 border-chat-knowledge-text rounded-full border-t-transparent" }) })) : searchResults.length > 0 ? (_jsx("div", { className: "space-y-3 max-h-[300px] overflow-y-auto chat-messages-container", children: searchResults.map((result) => (_jsxs("div", { className: "p-3 border border-chat-knowledge-border rounded-md", children: [_jsx("h4", { className: "font-medium text-chat-knowledge-text", children: result.title }), _jsx("p", { className: "text-sm text-white/80 mt-1", children: result.excerpt }), _jsx(Button, { variant: "outline", size: "sm", className: "mt-2 text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-text/10", children: "Insert Reference" })] }, result.id))) })) : searchQuery ? (_jsxs("div", { className: "text-center py-6 text-white/60", children: ["No results found for \"", searchQuery, "\""] })) : null })] }), _jsxs(DialogFooter, { className: "mt-4", children: [_jsxs(Button, { type: "button", variant: "secondary", onClick: () => setSearchQuery(''), children: [_jsx(X, { className: "mr-2 h-4 w-4" }), "Clear Search"] }), _jsxs(Button, { type: "submit", onClick: handleSearch, disabled: !searchQuery.trim() || isSearching, children: [_jsx(Search, { className: "mr-2 h-4 w-4" }), isSearching ? 'Searching...' : 'Search'] })] })] }));
}
