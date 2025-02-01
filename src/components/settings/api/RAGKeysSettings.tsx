import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/settings/useAPIConfigurations";
import { APIType } from "@/types/store/settings/api-config";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VECTOR_DB_CONFIGURATIONS } from "@/constants/api-configurations";
import { ServiceCard } from "./components/ServiceCard";

export function RAGKeysSettings() {
  const { configurations, createConfiguration } = useAPIConfigurations();
  const vectorDBConfigs = configurations.filter(
    config => config.api_type === 'pinecone' || config.api_type === 'weaviate'
  );

  const handleSaveConfig = async (type: APIType) => {
    try {
      await createConfiguration(type);
      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
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

      <div className="grid gap-6">
        {VECTOR_DB_CONFIGURATIONS.map((config) => {
          const existingConfigs = vectorDBConfigs.filter(c => c.api_type === config.type);
          
          return (
            <ServiceCard
              key={config.type}
              type={config.type}
              title={config.label}
              description={config.description}
              docsUrl={config.docsUrl}
              docsText={config.docsText}
              placeholder={config.placeholder}
              configurations={existingConfigs}
              newConfig={{
                name: '',
                key: '',
                endpoint_url: '',
                grpc_endpoint: '',
                read_only_key: '',
                environment: '',
                index_name: ''
              }}
              isConnecting={false}
              selectedConfig={null}
              onConnect={() => {}}
              onConfigChange={(type, field, value) => {
                // Handle config changes
              }}
              onSaveConfig={handleSaveConfig}
            />
          );
        })}
      </div>
    </div>
  );
}
