
import { useState } from "react";
import { APIType } from "@/types/admin/settings/api-configuration";
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
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [defaultRAGStorage, setDefaultRAGStorage] = useState("supabase");

  const handleConfigChange = (type: APIType, field: string, value: string) => {
    setNewConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = async (type: APIType, config: { 
    name: string; 
    key: string;
    environment?: string;
    index_name?: string;
  }) => {
    try {
      setIsConnecting(true);
      // Implementation of save logic will go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success(`${type} configuration saved successfully`);
      setNewConfig({ name: '', key: '', environment: '', index_name: '' });
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveDefaults = async () => {
    setIsConnecting(true);
    try {
      // Here we would save the default RAG storage preference to Supabase
      toast.success("Default RAG storage preferences saved");
    } catch (error) {
      console.error("Error saving RAG preferences:", error);
      toast.error("Failed to save RAG preferences");
    } finally {
      setIsConnecting(false);
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

      <Card>
        <CardHeader>
          <CardTitle>Default RAG Storage</CardTitle>
          <CardDescription>
            Choose where vector embeddings will be stored by default
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={defaultRAGStorage} 
            onValueChange={setDefaultRAGStorage}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 shadow-sm">
              <RadioGroupItem value="supabase" id="rag-supabase" />
              <Label htmlFor="rag-supabase" className="flex flex-1 items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Supabase Vector Store</p>
                  <p className="text-xs text-muted-foreground">
                    Suitable for small projects and starter use cases
                  </p>
                  <Badge className="mt-1" variant="outline">Default</Badge>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3 shadow-sm">
              <RadioGroupItem value="pinecone" id="rag-pinecone" />
              <Label htmlFor="rag-pinecone" className="flex flex-1 items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Pinecone Vector DB</p>
                  <p className="text-xs text-muted-foreground">
                    Advanced vector storage for large-scale applications
                  </p>
                  <Badge className="mt-1" variant="outline">Premium</Badge>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          <Button 
            onClick={handleSaveDefaults} 
            className="mt-6"
            disabled={isConnecting}
          >
            Save Default Storage
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <ServiceCard
          type="pinecone"
          title="Pinecone"
          description="Configure Pinecone vector database"
          docsUrl="https://docs.pinecone.io/docs"
          docsText="Pinecone documentation"
          placeholder="YOUR_API_KEY"
          onSaveConfig={handleSaveConfig}
          isConnecting={isConnecting}
          selectedConfig={selectedConfig}
          newConfig={newConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
    </div>
  );
}
