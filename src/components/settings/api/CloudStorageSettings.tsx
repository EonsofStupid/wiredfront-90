import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
              onChange={(e) => onGoogleDriveKeyChange(e.target.value)}
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
              onChange={(e) => onDropboxKeyChange(e.target.value)}
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
              onChange={(e) => onAwsAccessKeyChange(e.target.value)}
              placeholder="Enter AWS Access Key ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aws-secret-key">Secret Access Key</Label>
            <Input
              id="aws-secret-key"
              type="password"
              value={awsSecretKey}
              onChange={(e) => onAwsSecretKeyChange(e.target.value)}
              placeholder="Enter AWS Secret Access Key"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}