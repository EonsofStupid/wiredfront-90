import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface LivePreviewProps {
  files: Record<string, string>;
  activeFile?: string;
}

export const LivePreview = ({ files, activeFile }: LivePreviewProps) => {
  const [stackBlitzUrl, setStackBlitzUrl] = useState<string>('');
  const [viteUrl, setViteUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create StackBlitz project configuration
    const stackBlitzParams = new URLSearchParams({
      embed: '1',
      file: activeFile || 'src/App.tsx',
      hideNavigation: '1',
      theme: 'dark'
    });

    // Create Vite project configuration
    const viteParams = new URLSearchParams({
      file: activeFile || 'src/App.tsx',
      terminal: 'dev',
      preview: '5173'
    });

    const stackBlitzPreviewUrl = `https://stackblitz.com/edit/react-ts-preview?${stackBlitzParams}`;
    const vitePreviewUrl = `https://vite.new/react-ts?${viteParams}`;

    setStackBlitzUrl(stackBlitzPreviewUrl);
    setViteUrl(vitePreviewUrl);
    setIsLoading(false);
  }, [files, activeFile]);

  return (
    <Card className="h-full">
      <Tabs defaultValue="stackblitz" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stackblitz">StackBlitz</TabsTrigger>
          <TabsTrigger value="vite">Vite</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stackblitz" className="h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <iframe
              src={stackBlitzUrl}
              className="w-full h-full border-0"
              title="StackBlitz Editor"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          )}
        </TabsContent>

        <TabsContent value="vite" className="h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <iframe
              src={viteUrl}
              className="w-full h-full border-0"
              title="Vite Editor"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          )}
        </TabsContent>

        <TabsContent value="preview" className="h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <iframe
              src={`${stackBlitzUrl}&view=preview`}
              className="w-full h-full border-0"
              title="Live Preview"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};