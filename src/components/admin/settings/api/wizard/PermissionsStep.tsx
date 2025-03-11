
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, KeyRound, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PermissionsStepProps {
  selectedRoles: string[];
  onRoleChange: (role: string, checked: boolean) => void;
  selectedFeatures: string[];
  onFeatureChange: (feature: string, checked: boolean) => void;
}

export function PermissionsStep({
  selectedRoles,
  onRoleChange,
  selectedFeatures,
  onFeatureChange
}: PermissionsStepProps) {
  const roles = [
    { id: 'super_admin', label: 'Super Admin', description: 'Full administrative access' },
    { id: 'admin', label: 'Admin', description: 'Management access' },
    { id: 'developer', label: 'Developer', description: 'Developer tools access' },
    { id: 'user', label: 'User', description: 'Basic user access' }
  ];
  
  const features = [
    { id: 'chat', label: 'Chat', description: 'AI chat functionality' },
    { id: 'document_generation', label: 'Document Generation', description: 'Create documents using AI' },
    { id: 'code_analysis', label: 'Code Analysis', description: 'Code review and analysis features' },
    { id: 'rag', label: 'RAG', description: 'Retrieval-augmented generation' },
    { id: 'planning', label: '01 Planning', description: 'Advanced planning with reasoning' },
    { id: 'github_sync', label: 'GitHub Sync', description: 'Synchronize with GitHub repositories' }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Role Assignment
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Feature Binding
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-base">Assign to Roles</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Select which roles will have access to this API key
            </p>
            
            <div className="space-y-3">
              {roles.map(role => (
                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md" key={role.id}>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  
                  <Switch
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) => onRoleChange(role.id, checked)}
                  />
                </div>
              ))}
            </div>
            
            {selectedRoles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground mr-2">Assigned to:</span>
                {selectedRoles.map(role => (
                  <Badge key={role} variant="outline" className="capitalize">
                    {role.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-base">Bind to Features</Label>
            <p className="text-xs text-muted-foreground mb-3">
              Select which features will use this API key
            </p>
            
            <div className="space-y-3">
              {features.map(feature => (
                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md" key={feature.id}>
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  
                  <Switch
                    id={`feature-${feature.id}`}
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => onFeatureChange(feature.id, checked)}
                  />
                </div>
              ))}
            </div>
            
            {selectedFeatures.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground mr-2">Assigned to:</span>
                {selectedFeatures.map(feature => (
                  <Badge key={feature} variant="outline" className="capitalize">
                    {feature.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
