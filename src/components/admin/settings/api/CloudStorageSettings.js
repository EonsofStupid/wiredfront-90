import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
export function CloudStorageSettings({ googleDriveKey, dropboxKey, awsAccessKey, awsSecretKey, onGoogleDriveKeyChange, onDropboxKeyChange, onAwsAccessKeyChange, onAwsSecretKeyChange, }) {
    const handleSaveSecret = async (provider, value) => {
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
        }
        catch (error) {
            console.error('Error saving secret:', error);
            toast.error(error instanceof Error ? error.message : "Failed to save secret");
        }
    };
    const handleGoogleDriveKeyChange = (value) => {
        onGoogleDriveKeyChange(value);
        if (value)
            handleSaveSecret('google_drive', value);
    };
    const handleDropboxKeyChange = (value) => {
        onDropboxKeyChange(value);
        if (value)
            handleSaveSecret('dropbox', value);
    };
    const handleAwsAccessKeyChange = (value) => {
        onAwsAccessKeyChange(value);
        if (value)
            handleSaveSecret('aws_access', value);
    };
    const handleAwsSecretKeyChange = (value) => {
        onAwsSecretKeyChange(value);
        if (value)
            handleSaveSecret('aws_secret', value);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Google Drive API" }), _jsx(CardDescription, { children: "Configure Google Drive integration for cloud storage and file syncing." })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "google-drive-key", children: "API Key" }), _jsx(Input, { id: "google-drive-key", type: "password", value: googleDriveKey, onChange: (e) => handleGoogleDriveKeyChange(e.target.value), placeholder: "Enter Google Drive API key" })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Dropbox API" }), _jsx(CardDescription, { children: "Set up Dropbox integration for file management and backup." })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dropbox-key", children: "API Key" }), _jsx(Input, { id: "dropbox-key", type: "password", value: dropboxKey, onChange: (e) => handleDropboxKeyChange(e.target.value), placeholder: "Enter Dropbox API key" })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "AWS S3" }), _jsx(CardDescription, { children: "Configure AWS S3 for scalable cloud storage solutions." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "aws-access-key", children: "Access Key ID" }), _jsx(Input, { id: "aws-access-key", type: "password", value: awsAccessKey, onChange: (e) => handleAwsAccessKeyChange(e.target.value), placeholder: "Enter AWS Access Key ID" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "aws-secret-key", children: "Secret Access Key" }), _jsx(Input, { id: "aws-secret-key", type: "password", value: awsSecretKey, onChange: (e) => handleAwsSecretKeyChange(e.target.value), placeholder: "Enter AWS Secret Access Key" })] })] })] })] }));
}
