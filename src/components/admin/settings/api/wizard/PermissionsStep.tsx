
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const roles = ['super_admin', 'admin', 'developer', 'user'];
  const features = ['chat', 'document_generation', 'code_analysis', 'rag'];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Role Assignments</Label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(role => (
            <div className="flex items-center space-x-2" key={role}>
              <Switch
                id={`role-${role}`}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) => onRoleChange(role, checked)}
              />
              <Label htmlFor={`role-${role}`} className="capitalize">
                {role.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Select which roles will have access to this API key
        </p>
      </div>

      <div className="space-y-2">
        <Label>Feature Bindings</Label>
        <div className="grid grid-cols-2 gap-2">
          {features.map(feature => (
            <div className="flex items-center space-x-2" key={feature}>
              <Switch
                id={`feature-${feature}`}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={(checked) => onFeatureChange(feature, checked)}
              />
              <Label htmlFor={`feature-${feature}`} className="capitalize">
                {feature.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Select which features will use this API key
        </p>
      </div>
    </div>
  );
}
