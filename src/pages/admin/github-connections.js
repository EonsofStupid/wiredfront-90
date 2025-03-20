import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Clock, Github, RefreshCw, Search, Trash, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/chat/components/Spinner";
import { useSessionStore } from "@/stores/session/store";
export default function GitHubConnectionsAdmin() {
    const navigate = useNavigate();
    const { user } = useSessionStore();
    const [activeTab, setActiveTab] = useState("connections");
    const [connections, setConnections] = useState([]);
    const [logs, setLogs] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(null);
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const { data, error } = await supabase.rpc('is_super_admin', { user_id: user?.id });
                if (error || !data) {
                    toast.error("You don't have permission to access this page");
                    navigate('/');
                    return;
                }
            }
            catch (error) {
                console.error("Error checking admin status:", error);
                toast.error("Failed to verify permissions");
                navigate('/');
            }
        };
        if (user) {
            checkAdminStatus();
        }
        else {
            navigate('/');
        }
    }, [user, navigate]);
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (activeTab === "connections") {
                    const { data, error } = await supabase
                        .from('oauth_connections')
                        .select('*')
                        .eq('provider', 'github')
                        .order('updated_at', { ascending: false });
                    if (error)
                        throw error;
                    setConnections(data || []);
                }
                else if (activeTab === "logs") {
                    const { data, error } = await supabase
                        .from('github_oauth_logs')
                        .select('*')
                        .order('timestamp', { ascending: false })
                        .limit(100);
                    if (error)
                        throw error;
                    setLogs(data || []);
                }
                else if (activeTab === "metrics") {
                    const { data, error } = await supabase
                        .from('github_metrics')
                        .select('*')
                        .order('timestamp', { ascending: false })
                        .limit(50);
                    if (error)
                        throw error;
                    setMetrics(data || []);
                }
            }
            catch (error) {
                console.error(`Error loading ${activeTab}:`, error);
                toast.error(`Failed to load ${activeTab}`);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, [activeTab]);
    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            if (activeTab === "connections") {
                const { data, error } = await supabase
                    .from('oauth_connections')
                    .select('*')
                    .eq('provider', 'github')
                    .order('updated_at', { ascending: false });
                if (error)
                    throw error;
                setConnections(data || []);
            }
            else if (activeTab === "logs") {
                const { data, error } = await supabase
                    .from('github_oauth_logs')
                    .select('*')
                    .order('timestamp', { ascending: false })
                    .limit(100);
                if (error)
                    throw error;
                setLogs(data || []);
            }
            else if (activeTab === "metrics") {
                const { data, error } = await supabase
                    .from('github_metrics')
                    .select('*')
                    .order('timestamp', { ascending: false })
                    .limit(50);
                if (error)
                    throw error;
                setMetrics(data || []);
            }
            toast.success("Data refreshed successfully");
        }
        catch (error) {
            console.error(`Error refreshing ${activeTab}:`, error);
            toast.error(`Failed to refresh ${activeTab}`);
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const checkConnectionStatus = async (userId) => {
        setActionInProgress(userId);
        try {
            const { data, error } = await supabase.functions.invoke('github-token-management', {
                body: {
                    action: 'validate',
                    userId
                }
            });
            if (error)
                throw error;
            toast.success("Connection validated successfully");
            refreshData();
        }
        catch (error) {
            console.error("Error validating connection:", error);
            toast.error("Failed to validate connection");
        }
        finally {
            setActionInProgress(null);
        }
    };
    const revokeConnection = async (userId) => {
        if (!confirm("Are you sure you want to revoke this connection?"))
            return;
        setActionInProgress(userId);
        try {
            const { data, error } = await supabase.functions.invoke('github-token-management', {
                body: {
                    action: 'revoke',
                    userId
                }
            });
            if (error)
                throw error;
            toast.success("Connection revoked successfully");
            refreshData();
        }
        catch (error) {
            console.error("Error revoking connection:", error);
            toast.error("Failed to revoke connection");
        }
        finally {
            setActionInProgress(null);
        }
    };
    const filteredConnections = connections.filter(conn => conn.account_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conn.user_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredLogs = logs.filter(log => log.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.error_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.request_id?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredMetrics = metrics.filter(metric => metric.metric_type?.toLowerCase().includes(searchTerm.toLowerCase()));
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'connected':
                return _jsxs(Badge, { className: "bg-green-500", children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), " Connected"] });
            case 'error':
                return _jsxs(Badge, { variant: "destructive", children: [_jsx(AlertCircle, { className: "w-3 h-3 mr-1" }), " Error"] });
            case 'disconnected':
                return _jsxs(Badge, { variant: "outline", children: [_jsx(XCircle, { className: "w-3 h-3 mr-1" }), " Disconnected"] });
            default:
                return _jsxs(Badge, { variant: "secondary", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), " ", status] });
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-6 w-6" }), _jsx("h1", { className: "text-2xl font-bold", children: "GitHub Connections Admin" })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => navigate('/admin'), children: "Back to Admin" })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { children: "GitHub OAuth Management" }), _jsx(CardDescription, { children: "Manage GitHub connections, review logs, and monitor metrics" })] }), _jsx(CardContent, { children: _jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "connections", children: "User Connections" }), _jsx(TabsTrigger, { value: "logs", children: "OAuth Logs" }), _jsx(TabsTrigger, { value: "metrics", children: "Metrics" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "relative w-64", children: [_jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-8" })] }), _jsx(Button, { variant: "outline", size: "icon", onClick: refreshData, disabled: isRefreshing, children: isRefreshing ? (_jsx(Spinner, { size: "sm" })) : (_jsx(RefreshCw, { className: "h-4 w-4" })) })] })] }), _jsx(TabsContent, { value: "connections", className: "mt-4", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(Spinner, { size: "lg", label: "Loading connections..." }) })) : filteredConnections.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No GitHub connections found" })) : (_jsx("div", { className: "rounded-md border overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "GitHub Account" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Last Updated" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: filteredConnections.map((connection) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "font-medium", children: [connection.user_id.substring(0, 8), "..."] }), _jsxs(TableCell, { className: "flex items-center gap-2", children: [_jsx(Github, { className: "h-4 w-4" }), connection.account_username || "Unknown"] }), _jsx(TableCell, { children: connection.expires_at && new Date(connection.expires_at) < new Date() ? (_jsxs(Badge, { variant: "outline", className: "text-amber-500 border-amber-500", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), " Expired"] })) : (_jsxs(Badge, { variant: "outline", className: "text-green-500 border-green-500", children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), " Active"] })) }), _jsx(TableCell, { children: formatDate(connection.updated_at) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => checkConnectionStatus(connection.user_id), disabled: actionInProgress === connection.user_id, children: [actionInProgress === connection.user_id ? (_jsx(Spinner, { size: "sm", className: "mr-1" })) : (_jsx(RefreshCw, { className: "h-3 w-3 mr-1" })), "Validate"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "text-destructive hover:bg-destructive/10", onClick: () => revokeConnection(connection.user_id), disabled: actionInProgress === connection.user_id, children: [actionInProgress === connection.user_id ? (_jsx(Spinner, { size: "sm", className: "mr-1" })) : (_jsx(Trash, { className: "h-3 w-3 mr-1" })), "Revoke"] })] }) })] }, connection.id))) })] }) })) }), _jsx(TabsContent, { value: "logs", className: "mt-4", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(Spinner, { size: "lg", label: "Loading logs..." }) })) : filteredLogs.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No logs found" })) : (_jsx("div", { className: "rounded-md border overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Timestamp" }), _jsx(TableHead, { children: "Event Type" }), _jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Error" }), _jsx(TableHead, { children: "Trace ID" })] }) }), _jsx(TableBody, { children: filteredLogs.map((log) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: formatDate(log.timestamp) }), _jsx(TableCell, { className: "font-medium", children: log.event_type }), _jsx(TableCell, { children: log.user_id ? log.user_id.substring(0, 8) + '...' : '-' }), _jsx(TableCell, { children: log.success === true ? (_jsxs(Badge, { variant: "outline", className: "text-green-500 border-green-500", children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), " Success"] })) : log.success === false ? (_jsxs(Badge, { variant: "outline", className: "text-red-500 border-red-500", children: [_jsx(XCircle, { className: "w-3 h-3 mr-1" }), " Failed"] })) : (_jsxs(Badge, { variant: "outline", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), " Info"] })) }), _jsx(TableCell, { className: "max-w-[200px] truncate", children: log.error_message || '-' }), _jsx(TableCell, { className: "font-mono text-xs", children: log.request_id || log.metadata?.trace_id || '-' })] }, log.id))) })] }) })) }), _jsx(TabsContent, { value: "metrics", className: "mt-4", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(Spinner, { size: "lg", label: "Loading metrics..." }) })) : filteredMetrics.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "No metrics found" })) : (_jsx("div", { className: "rounded-md border overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Timestamp" }), _jsx(TableHead, { children: "Metric Type" }), _jsx(TableHead, { children: "Value" }), _jsx(TableHead, { children: "Metadata" })] }) }), _jsx(TableBody, { children: filteredMetrics.map((metric) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: formatDate(metric.timestamp) }), _jsx(TableCell, { className: "font-medium", children: metric.metric_type }), _jsx(TableCell, { children: metric.value !== null ? metric.value : '-' }), _jsx(TableCell, { className: "max-w-[300px] truncate", children: metric.metadata ? JSON.stringify(metric.metadata) : '-' })] }, metric.id))) })] }) })) })] }) }) })] })] }));
}
