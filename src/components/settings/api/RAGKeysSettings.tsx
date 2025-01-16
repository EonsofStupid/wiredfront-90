import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useServiceConnection } from "./hooks/useServiceConnection";

export function RAGKeysSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();
  const { isConnecting, selectedConfig, handleConnect } = useServiceConnection();
  const [weaviateConfig, setWeaviateConfig] = useState({
    name: '',
    restEndpoint: '',
    grpcEndpoint: '',
    adminKey: '',
    readOnlyKey: '',
    clusterInfo: {
      version: '',
      region: '',
      type: '',
      sla: '',
      highAvailability: false
    }
  });

  const [pineconeConfig, setPineconeConfig] = useState({
    apiKey: '',
    environment: '',
    indexName: ''
  });

  const handleWeaviateChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setWeaviateConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setWeaviateConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePineconeChange = (field: string, value: string) => {
    setPineconeConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveWeaviate = async () => {
    try {
      await createConfiguration('weaviate', {
        assistant_name: weaviateConfig.name,
        provider_settings: {
          endpoint_url: weaviateConfig.restEndpoint,
          grpc_endpoint: weaviateConfig.grpcEndpoint,
          admin_key: weaviateConfig.adminKey,
          read_only_key: weaviateConfig.readOnlyKey,
          cluster_info: weaviateConfig.clusterInfo
        }
      });
      toast.success("Weaviate configuration saved successfully");
    } catch (error) {
      console.error('Error saving Weaviate configuration:', error);
      toast.error("Failed to save Weaviate configuration");
    }
  };

  const handleSavePinecone = async () => {
    try {
      await createConfiguration('pinecone', {
        provider_settings: {
          api_key: pineconeConfig.apiKey,
          environment: pineconeConfig.environment,
          index_name: pineconeConfig.indexName
        }
      });
      toast.success("Pinecone configuration saved successfully");
    } catch (error) {
      console.error('Error saving Pinecone configuration:', error);
      toast.error("Failed to save Pinecone configuration");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Vector Database Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your vector database connections for RAG capabilities.
        </p>
      </div>

      <Tabs defaultValue="weaviate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weaviate">Weaviate</TabsTrigger>
          <TabsTrigger value="pinecone">Pinecone</TabsTrigger>
        </TabsList>

        <TabsContent value="weaviate">
          <Card>
            <CardHeader>
              <CardTitle>Weaviate Configuration</CardTitle>
              <CardDescription>
                Configure your Weaviate vector database connection settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weaviate-name">Cluster Name</Label>
                <Input
                  id="weaviate-name"
                  placeholder="e.g., my-weaviate-cluster"
                  value={weaviateConfig.name}
                  onChange={(e) => handleWeaviateChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaviate-rest">REST Endpoint</Label>
                <Input
                  id="weaviate-rest"
                  placeholder="https://your-weaviate-url.cloud"
                  value={weaviateConfig.restEndpoint}
                  onChange={(e) => handleWeaviateChange('restEndpoint', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaviate-grpc">gRPC Endpoint</Label>
                <Input
                  id="weaviate-grpc"
                  placeholder="https://grpc-your-weaviate-url.cloud"
                  value={weaviateConfig.grpcEndpoint}
                  onChange={(e) => handleWeaviateChange('grpcEndpoint', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaviate-admin">Admin API Key</Label>
                <Input
                  id="weaviate-admin"
                  type="password"
                  placeholder="Enter Admin API Key"
                  value={weaviateConfig.adminKey}
                  onChange={(e) => handleWeaviateChange('adminKey', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaviate-readonly">Read-Only API Key</Label>
                <Input
                  id="weaviate-readonly"
                  type="password"
                  placeholder="Enter Read-Only API Key"
                  value={weaviateConfig.readOnlyKey}
                  onChange={(e) => handleWeaviateChange('readOnlyKey', e.target.value)}
                />
              </div>

              <Button onClick={handleSaveWeaviate} className="w-full">
                Save Weaviate Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pinecone">
          <Card>
            <CardHeader>
              <CardTitle>Pinecone Configuration</CardTitle>
              <CardDescription>
                Configure your Pinecone vector database connection settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pinecone-key">API Key</Label>
                <Input
                  id="pinecone-key"
                  type="password"
                  placeholder="Enter Pinecone API Key"
                  value={pineconeConfig.apiKey}
                  onChange={(e) => handlePineconeChange('apiKey', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinecone-env">Environment</Label>
                <Input
                  id="pinecone-env"
                  placeholder="e.g., us-east-1-aws"
                  value={pineconeConfig.environment}
                  onChange={(e) => handlePineconeChange('environment', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinecone-index">Index Name</Label>
                <Input
                  id="pinecone-index"
                  placeholder="e.g., my-index"
                  value={pineconeConfig.indexName}
                  onChange={(e) => handlePineconeChange('indexName', e.target.value)}
                />
              </div>

              <Button onClick={handleSavePinecone} className="w-full">
                Save Pinecone Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}