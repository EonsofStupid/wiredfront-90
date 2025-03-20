import { useState, useEffect } from "react";
// Sample data generator function
export const generateSampleData = () => {
    const now = new Date();
    const data = [];
    for (let i = 12; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            apiLatency: Math.floor(Math.random() * 200) + 100,
            cpuUsage: Math.floor(Math.random() * 40) + 20,
            memory: Math.floor(Math.random() * 30) + 40,
            requestCount: Math.floor(Math.random() * 50) + 150
        });
    }
    return data;
};
// Define available metrics
export const metrics = [
    { id: 'apiLatency', name: 'API Latency', unit: 'ms', color: '#8B5CF6' },
    { id: 'cpuUsage', name: 'CPU Usage', unit: '%', color: '#EC4899' },
    { id: 'memory', name: 'Memory', unit: '%', color: '#0EA5E9' },
    { id: 'requestCount', name: 'Request Count', unit: '', color: '#10B981' }
];
// Custom hook for performance chart data
export function usePerformanceChartData() {
    const [data, setData] = useState(() => generateSampleData());
    const [activeMetric, setActiveMetric] = useState('apiLatency');
    const [chartType, setChartType] = useState('area');
    // Refreshes data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const newData = [...data];
            // Remove oldest data point
            newData.shift();
            // Add new data point
            const now = new Date();
            newData.push({
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                apiLatency: Math.floor(Math.random() * 200) + 100,
                cpuUsage: Math.floor(Math.random() * 40) + 20,
                memory: Math.floor(Math.random() * 30) + 40,
                requestCount: Math.floor(Math.random() * 50) + 150
            });
            setData(newData);
        }, 30000);
        return () => clearInterval(interval);
    }, [data]);
    // Get current metric information
    const currentMetric = metrics.find(m => m.id === activeMetric);
    return {
        data,
        activeMetric,
        setActiveMetric,
        chartType,
        setChartType,
        currentMetric,
        metrics
    };
}
