
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LivePreviewProps {
  files: Record<string, string>;
  activeFile: string;
}

export const LivePreview = ({ files, activeFile }: LivePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePreview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize preview service
        const response = await fetch('/api/preview/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files,
            activeFile
          })
        });

        if (!response.ok) {
          throw new Error('Failed to initialize preview');
        }

        const { previewUrl } = await response.json();
        setPreviewUrl(previewUrl);
      } catch (error) {
        console.error('Error initializing preview:', error);
        setError('Failed to initialize preview');
        toast.error('Failed to initialize preview');
      } finally {
        setIsLoading(false);
      }
    };

    initializePreview();
  }, [files, activeFile]);

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <Tabs defaultValue="preview" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="devtools">DevTools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Live Preview"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              loading="lazy"
            />
          )}
        </TabsContent>

        <TabsContent value="devtools" className="h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Project Files</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                {JSON.stringify(files, null, 2)}
              </pre>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
