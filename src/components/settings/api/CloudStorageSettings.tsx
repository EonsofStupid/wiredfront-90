import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CloudStorageSettingsProps {
  googleDriveKey: string;
  dropboxKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  onGoogleDriveKeyChange: (value: string) => void;
  onDropboxKeyChange: (value: string) => void;
  onAwsAccessKeyChange: (value: string) => void;
  onAwsSecretKeyChange: (value: string) => void;
}

export function CloudStorageSettings({
  googleDriveKey,
  dropboxKey,
  awsAccessKey,
  awsSecretKey,
  onGoogleDriveKeyChange,
  onDropboxKeyChange,
  onAwsAccessKeyChange,
  onAwsSecretKeyChange,
}: CloudStorageSettingsProps) {
  const handleSaveSecret = async (provider: string, value: string) => {
    try {
      const secretName = `${provider.toUpperCase()}_API_KEY`;
      
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: { 
          secretName,
          secretValue: value,
          provider
        }
      });

      if (error) {
        console.error('Error saving secret:', error);
        throw new Error(error.message || 'Failed to save secret');
      }

      if (!data?.success) {
        throw new Error('Failed to save secret');
      }

      toast.success(`${provider} API key saved successfully`);
    } catch (error) {
      console.error('Error saving secret:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save secret");
    }
  };

  const handleGoogleDriveKeyChange = (value: string) => {
    onGoogleDriveKeyChange(value);
    if (value) handleSaveSecret('google_drive', value);
  };

  const handleDropboxKeyChange = (value: string) => {
    onDropboxKeyChange(value);
    if (value) handleSaveSecret('dropbox', value);
  };

  const handleAwsAccessKeyChange = (value: string) => {
    onAwsAccessKeyChange(value);
    if (value) handleSaveSecret('aws_access', value);
  };

  const handleAwsSecretKeyChange = (value: string) => {
    onAwsSecretKeyChange(value);
    if (value) handleSaveSecret('aws_secret', value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Drive API</CardTitle>
          <CardDescription>
            Configure Google Drive integration for cloud storage and file syncing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-drive-key">API Key</Label>
            <Input
              id="google-drive-key"
              type="password"
              value={googleDriveKey}
              onChange={(e) => handleGoogleDriveKeyChange(e.target.value)}
              placeholder="Enter Google Drive API key"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dropbox API</CardTitle>
          <CardDescription>
            Set up Dropbox integration for file management and backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dropbox-key">API Key</Label>
            <Input
              id="dropbox-key"
              type="password"
              value={dropboxKey}
              onChange={(e) => handleDropboxKeyChange(e.target.value)}
              placeholder="Enter Dropbox API key"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AWS S3</CardTitle>
          <CardDescription>
            Configure AWS S3 for scalable cloud storage solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aws-access-key">Access Key ID</Label>
            <Input
              id="aws-access-key"
              type="password"
              value={awsAccessKey}
              onChange={(e) => handleAwsAccessKeyChange(e.target.value)}
              placeholder="Enter AWS Access Key ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aws-secret-key">Secret Access Key</Label>
            <Input
              id="aws-secret-key"
              type="password"
              value={awsSecretKey}
              onChange={(e) => handleAwsSecretKeyChange(e.target.value)}
              placeholder="Enter AWS Secret Access Key"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}