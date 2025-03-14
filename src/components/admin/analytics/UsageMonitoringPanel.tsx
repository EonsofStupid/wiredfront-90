
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

interface RAGMetrics {
  id: string;
  user_id: string;
  query_count: number;
  vector_count: number;
  token_usage: number;
  average_latency: number;
  created_at: string;
  updated_at: string;
  username?: string; // Will be added manually after querying
}

export const UsageMonitoringPanel = () => {
  const [timeRange, setTimeRange] = useState<string>("7d"); // 24h, 7d, 30d, all

  const { data: usageMetrics, isLoading, error } = useQuery({
    queryKey: ['admin', 'rag-metrics', timeRange],
    queryFn: async (): Promise<RAGMetrics[]> => {
      // Calculate date filter based on timeRange
      let fromDate: string | null = null;
      
      if (timeRange !== 'all') {
        const now = new Date();
        if (timeRange === '24h') {
          fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        } else if (timeRange === '7d') {
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (timeRange === '30d') {
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        }
      }

      // First, get the RAG metrics
      let query = supabase.from('rag_metrics').select('*');
      
      // Add time range filter if applicable
      if (fromDate) {
        query = query.gte('created_at', fromDate);
      }

      const { data: metricsData, error: metricsError } = await query;
      
      if (metricsError) throw metricsError;
      
      // Next, get the user profiles to map usernames
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');
        
      if (profilesError) throw profilesError;
      
      // Map the usernames to the metrics data
      const metricsWithUsernames = metricsData.map((metric: any) => {
        const profile = profiles.find((p: any) => p.id === metric.user_id);
        return {
          ...metric,
          username: profile?.username || metric.user_id.substring(0, 8)
        };
      });
      
      return metricsWithUsernames;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const downloadReport = () => {
    if (!usageMetrics) return;
    
    // Format data for CSV
    const csvContent = [
      // Header row
      ["User", "Queries", "Vectors", "Tokens", "Avg Latency (ms)", "Last Updated"].join(","),
      // Data rows
      ...usageMetrics.map(metric => [
        metric.username || metric.user_id.substring(0, 8),
        metric.query_count,
        metric.vector_count,
        metric.token_usage,
        metric.average_latency,
        new Date(metric.updated_at).toLocaleString()
      ].join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rag-usage-report-${timeRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare data for charts
  const chartData = usageMetrics?.map(metric => ({
    name: metric.username || metric.user_id.substring(0, 8),
    queries: metric.query_count,
    vectors: metric.vector_count,
    tokens: metric.token_usage
  })) || [];

  if (isLoading) return <div>Loading usage data...</div>;
  if (error) return <div>Error loading usage data: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RAG Usage Analytics</h2>
          <p className="text-muted-foreground">
            Monitor vector storage and query usage across users
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={downloadReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Query Usage</CardTitle>
            <CardDescription>Number of RAG queries by user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="queries" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vector Storage</CardTitle>
            <CardDescription>Number of vectors stored by user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vectors" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Usage Metrics</CardTitle>
          <CardDescription>
            Complete breakdown of RAG usage per user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Queries</TableHead>
                <TableHead>Vectors Stored</TableHead>
                <TableHead>Tokens Used</TableHead>
                <TableHead>Avg. Latency (ms)</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageMetrics?.map(metric => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">
                    {metric.username || metric.user_id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{metric.query_count}</TableCell>
                  <TableCell>{metric.vector_count}</TableCell>
                  <TableCell>{metric.token_usage}</TableCell>
                  <TableCell>{metric.average_latency.toFixed(2)}</TableCell>
                  <TableCell>{new Date(metric.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
