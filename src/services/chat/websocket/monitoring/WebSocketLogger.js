import { create } from 'zustand';
const useWebSocketLogger = create((set, get) => ({
    logs: [],
    metrics: {
        messagesSent: 0,
        messagesReceived: 0,
        latency: 0,
        uptime: 0,
        reconnectAttempts: 0,
    },
    connectionState: 'initial',
    addLog: (level, message) => {
        set((state) => ({
            logs: [
                { timestamp: Date.now(), level, message },
                ...state.logs,
            ].slice(0, 1000),
        }));
    },
    updateMetrics: (updates) => {
        set((state) => ({
            metrics: { ...state.metrics, ...updates },
        }));
    },
    updateConnectionState: (state) => {
        set({ connectionState: state });
    },
    getLogs: () => get().logs,
    getMetrics: () => get().metrics,
    getConnectionState: () => get().connectionState,
    resetMetrics: () => {
        set({
            metrics: {
                messagesSent: 0,
                messagesReceived: 0,
                latency: 0,
                uptime: 0,
                reconnectAttempts: 0,
            },
        });
    },
}));
class WebSocketLoggerInstance {
    constructor() { }
    static getInstance() {
        if (!WebSocketLoggerInstance.instance) {
            WebSocketLoggerInstance.instance = new WebSocketLoggerInstance();
        }
        return WebSocketLoggerInstance.instance;
    }
    getMetrics() {
        return useWebSocketLogger.getState().getMetrics();
    }
    getLogs() {
        return useWebSocketLogger.getState().getLogs();
    }
    getConnectionState() {
        return useWebSocketLogger.getState().getConnectionState();
    }
}
export const WebSocketLogger = {
    getInstance: () => WebSocketLoggerInstance.getInstance(),
    logMessage: (message, metadata) => {
        useWebSocketLogger.getState().addLog('info', message);
    },
    updateConnectionState: (state) => {
        useWebSocketLogger.getState().updateConnectionState(state);
    },
    incrementReconnectCount: () => {
        const currentMetrics = useWebSocketLogger.getState().getMetrics();
        useWebSocketLogger.getState().updateMetrics({
            reconnectAttempts: currentMetrics.reconnectAttempts + 1,
        });
    },
    resetMetrics: () => useWebSocketLogger.getState().resetMetrics(),
    getMetrics: () => useWebSocketLogger.getState().getMetrics(),
};
