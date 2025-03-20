import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/stores/session/store';
import { logger } from '@/services/chat/LoggingService';
// Get the Supabase URL from the client configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://deksjwrdczcsnryjohzg.supabase.co";
const GitHubCallback = () => {
    const navigate = useNavigate();
    const { user } = useSessionStore();
    const [status, setStatus] = useState('processing');
    const [errorMessage, setErrorMessage] = useState(null);
    const [traceId, setTraceId] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;
    useEffect(() => {
        const logCallbackEvent = (eventType, data) => {
            logger.info(`GitHub Callback: ${eventType}`, { ...data, traceId });
            console.log(`GitHub Callback: ${eventType}`, { ...data, traceId });
        };
        const handleCallback = async () => {
            try {
                // Get URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const state = urlParams.get('state');
                const error = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');
                logCallbackEvent('callback_loaded', {
                    hasCode: !!code,
                    hasState: !!state,
                    error,
                    errorDescription,
                    userId: user?.id
                });
                // If there's an error from GitHub, handle it
                if (error) {
                    logCallbackEvent('oauth_error', { error, errorDescription });
                    setStatus('error');
                    setErrorMessage(errorDescription || 'Authentication failed');
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'github-auth-error',
                            error: errorDescription || 'Authentication failed',
                            trace_id: traceId
                        }, window.location.origin);
                        // Also try with * as a fallback
                        window.opener.postMessage({
                            type: 'github-auth-error',
                            error: errorDescription || 'Authentication failed',
                            trace_id: traceId
                        }, '*');
                    }
                    // Record the error in Supabase
                    try {
                        await supabase.from('github_oauth_logs').insert({
                            event_type: 'github_redirect_error',
                            user_id: user?.id,
                            success: false,
                            error_code: error,
                            error_message: errorDescription,
                            metadata: {
                                state,
                                from: 'callback_page'
                            }
                        });
                    }
                    catch (logError) {
                        console.error('Failed to log OAuth error:', logError);
                    }
                    toast.error(`GitHub Authentication Error: ${errorDescription || 'Unknown error'}`);
                    return;
                }
                // If we don't have a code and state, something went wrong
                if (!code || !state) {
                    logCallbackEvent('invalid_parameters', { code, state });
                    setStatus('error');
                    setErrorMessage('Invalid response from GitHub - missing code or state parameter');
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'github-auth-error',
                            error: 'Invalid response from GitHub - missing code or state parameter',
                            trace_id: traceId
                        }, window.location.origin);
                        // Also try with * as a fallback
                        window.opener.postMessage({
                            type: 'github-auth-error',
                            error: 'Invalid response from GitHub - missing code or state parameter',
                            trace_id: traceId
                        }, '*');
                    }
                    // Record the error in Supabase
                    try {
                        await supabase.from('github_oauth_logs').insert({
                            event_type: 'missing_parameters',
                            user_id: user?.id,
                            success: false,
                            error_code: 'MISSING_PARAMS',
                            error_message: 'Missing code or state parameter',
                            metadata: {
                                from: 'callback_page'
                            }
                        });
                    }
                    catch (logError) {
                        console.error('Failed to log OAuth error:', logError);
                    }
                    toast.error('GitHub Authentication Failed: Invalid response');
                    return;
                }
                // Get the current URL to use as the redirect URI
                const currentUrl = window.location.href.split('?')[0];
                const supabaseCallbackUrl = `${SUPABASE_URL}/auth/v1/callback`;
                logCallbackEvent('callback_urls', {
                    currentUrl,
                    supabaseCallbackUrl
                });
                // Exchange the code for a token
                logCallbackEvent('exchanging_code', {
                    code: code.substring(0, 5) + '...',
                    redirect_uri: currentUrl
                });
                const { data, error: exchangeError } = await supabase.functions.invoke('github-oauth-callback', {
                    body: {
                        code,
                        state,
                        redirect_uri: currentUrl // Pass the redirect URI to the function
                    }
                });
                logCallbackEvent('token_exchange_response', {
                    success: !!data?.success,
                    error: exchangeError,
                    trace_id: data?.trace_id,
                    username: data?.username
                });
                // Set the trace ID from the response
                if (data?.trace_id) {
                    setTraceId(data.trace_id);
                }
                if (exchangeError) {
                    throw new Error(exchangeError.message || 'Failed to exchange GitHub code');
                }
                if (!data?.success) {
                    throw new Error(data?.error || 'Failed to exchange GitHub code');
                }
                logCallbackEvent('exchange_success', { username: data.username });
                setStatus('success');
                // Notify the parent window of success
                if (window.opener) {
                    const message = {
                        type: 'github-auth-success',
                        username: data?.username || null,
                        trace_id: data?.trace_id
                    };
                    // Try to post message with specific origin first
                    window.opener.postMessage(message, window.location.origin);
                    // Also try with * as a fallback
                    window.opener.postMessage(message, '*');
                    logCallbackEvent('success_message_sent', { message });
                }
                else {
                    logCallbackEvent('no_opener_window', {});
                }
                toast.success('GitHub authentication successful!');
                // Record successful authentication in Supabase
                try {
                    await supabase.from('github_oauth_logs').insert({
                        event_type: 'authentication_success',
                        user_id: user?.id,
                        success: true,
                        metadata: {
                            username: data?.username,
                            trace_id: data?.trace_id,
                            from: 'callback_page'
                        }
                    });
                }
                catch (logError) {
                    console.error('Failed to log OAuth success:', logError);
                }
            }
            catch (err) {
                logCallbackEvent('exchange_error', {
                    error: err instanceof Error ? err.message : String(err),
                    retryCount
                });
                // Handle retry logic for temporary errors
                if (retryCount < maxRetries) {
                    // Increment retry counter and attempt again after delay
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => handleCallback(), 1000 * (retryCount + 1)); // Exponential backoff
                    return;
                }
                setStatus('error');
                const errorMsg = err instanceof Error ? err.message : 'Failed to complete GitHub authentication';
                setErrorMessage(errorMsg);
                if (window.opener) {
                    const errorMessage = {
                        type: 'github-auth-error',
                        error: errorMsg,
                        trace_id: traceId
                    };
                    // Try to post message with specific origin first
                    window.opener.postMessage(errorMessage, window.location.origin);
                    // Also try with * as a fallback
                    window.opener.postMessage(errorMessage, '*');
                }
                // Record the error in Supabase
                try {
                    await supabase.from('github_oauth_logs').insert({
                        event_type: 'code_exchange_error',
                        user_id: user?.id,
                        success: false,
                        error_message: errorMsg,
                        metadata: {
                            trace_id: traceId,
                            from: 'callback_page',
                            retry_count: retryCount
                        }
                    });
                }
                catch (logError) {
                    console.error('Failed to log OAuth error:', logError);
                }
                toast.error('GitHub Authentication Failed: Unable to exchange code for token');
            }
        };
        handleCallback();
        // Close this window automatically after a short delay
        const timeout = setTimeout(() => {
            if (window.opener && status !== 'processing') {
                window.close();
            }
            // If window doesn't close (some browsers prevent this), navigate back to home
            if (status !== 'processing') {
                navigate('/');
            }
        }, status === 'error' ? 5000 : 3000); // Longer delay for errors so users can read the message
        return () => clearTimeout(timeout);
    }, [navigate, status, traceId, retryCount, user?.id]);
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: _jsx("div", { className: "max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-xl font-bold mb-4", children: "GitHub Authentication" }), status === 'processing' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }), _jsx("p", { children: "Processing your GitHub authentication..." }), retryCount > 0 && (_jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: ["Retry attempt ", retryCount, " of ", maxRetries, "..."] }))] })), status === 'success' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4 text-green-500", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsx("p", { className: "text-green-500 font-medium mb-2", children: "Successfully connected to GitHub!" }), traceId && (_jsx("div", { className: "mt-4 p-2 bg-muted rounded-md", children: _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Trace ID: ", traceId] }) }))] })), status === 'error' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4 text-red-500", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }), _jsx("p", { className: "text-red-500 font-medium mb-2", children: "Authentication Error" }), errorMessage && _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: errorMessage }), traceId && (_jsxs("div", { className: "mt-4 p-2 bg-muted rounded-md", children: [_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Trace ID: ", traceId] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Please provide this ID to an administrator for troubleshooting." })] }))] })), _jsx("p", { className: "text-sm text-muted-foreground mt-4", children: "This window will close automatically." })] }) }) }));
};
export default GitHubCallback;
