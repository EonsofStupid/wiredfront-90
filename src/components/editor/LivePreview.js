import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
export const LivePreview = ({ files, activeFile }) => {
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const initializePreview = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Initialize preview service
                const response = await fetch('/api/preview/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        files,
                        activeFile
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to initialize preview');
                }
                const { previewUrl } = await response.json();
                setPreviewUrl(previewUrl);
            }
            catch (error) {
                console.error('Error initializing preview:', error);
                setError('Failed to initialize preview');
                toast.error('Failed to initialize preview');
            }
            finally {
                setIsLoading(false);
            }
        };
        initializePreview();
    }, [files, activeFile]);
    if (error) {
        return (_jsx(Card, { className: "h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-destructive", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Retry" })] }) }));
    }
    return (_jsx(Card, { className: "h-full", children: _jsxs(Tabs, { defaultValue: "preview", className: "w-full h-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsx(TabsTrigger, { value: "preview", children: "Live Preview" }), _jsx(TabsTrigger, { value: "devtools", children: "DevTools" })] }), _jsx(TabsContent, { value: "preview", className: "h-[calc(100%-40px)]", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) })) : (_jsx("iframe", { src: previewUrl, className: "w-full h-full border-0", title: "Live Preview", allow: "accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking", sandbox: "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts", loading: "lazy" })) }), _jsx(TabsContent, { value: "devtools", className: "h-[calc(100%-40px)]", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) })) : (_jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Project Files" }), _jsx("pre", { className: "bg-muted p-4 rounded-md overflow-auto max-h-[500px]", children: JSON.stringify(files, null, 2) })] })) })] }) }));
};
