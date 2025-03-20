import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
export function RAGKeysSettings() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [newConfig, setNewConfig] = useState({
        name: '',
        key: '',
        environment: '',
        index_name: ''
    });
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [defaultRAGStorage, setDefaultRAGStorage] = useState("supabase");
    const handleConfigChange = (type, field, value) => {
        setNewConfig(prev => ({ ...prev, [field]: value }));
    };
    const handleSaveConfig = async (type, config) => {
        try {
            setIsConnecting(true);
            // Implementation of save logic will go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
            toast.success(`${type} configuration saved successfully`);
            setNewConfig({ name: '', key: '', environment: '', index_name: '' });
        }
        catch (error) {
            console.error(`Error saving ${type} configuration:`, error);
            toast.error(`Failed to save ${type} configuration`);
        }
        finally {
            setIsConnecting(false);
        }
    };
    const handleSaveDefaults = async () => {
        setIsConnecting(true);
        try {
            // Here we would save the default RAG storage preference to Supabase
            toast.success("Default RAG storage preferences saved");
        }
        catch (error) {
            console.error("Error saving RAG preferences:", error);
            toast.error("Failed to save RAG preferences");
        }
        finally {
            setIsConnecting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: "Vector Database Settings" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Configure your vector database connections for RAG capabilities." })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Default RAG Storage" }), _jsx(CardDescription, { children: "Choose where vector embeddings will be stored by default" })] }), _jsxs(CardContent, { children: [_jsxs(RadioGroup, { value: defaultRAGStorage, onValueChange: setDefaultRAGStorage, className: "flex flex-col space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-2 rounded-md border p-3 shadow-sm", children: [_jsx(RadioGroupItem, { value: "supabase", id: "rag-supabase" }), _jsxs(Label, { htmlFor: "rag-supabase", className: "flex flex-1 items-center gap-2", children: [_jsx(Database, { className: "h-4 w-4 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Supabase Vector Store" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Suitable for small projects and starter use cases" }), _jsx(Badge, { className: "mt-1", variant: "outline", children: "Default" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2 rounded-md border p-3 shadow-sm", children: [_jsx(RadioGroupItem, { value: "pinecone", id: "rag-pinecone" }), _jsxs(Label, { htmlFor: "rag-pinecone", className: "flex flex-1 items-center gap-2", children: [_jsx(Server, { className: "h-4 w-4 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "Pinecone Vector DB" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Advanced vector storage for large-scale applications" }), _jsx(Badge, { className: "mt-1", variant: "outline", children: "Premium" })] })] })] })] }), _jsx(Button, { onClick: handleSaveDefaults, className: "mt-6", disabled: isConnecting, children: "Save Default Storage" })] })] }), _jsx("div", { className: "grid gap-6", children: _jsx(ServiceCard, { type: "pinecone", title: "Pinecone", description: "Configure Pinecone vector database", docsUrl: "https://docs.pinecone.io/docs", docsText: "Pinecone documentation", placeholder: "YOUR_API_KEY", onSaveConfig: handleSaveConfig, isConnecting: isConnecting, selectedConfig: selectedConfig, newConfig: newConfig, onConfigChange: handleConfigChange }) })] }));
}
