import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatFeatureSettings } from '@/components/admin/settings/ChatFeatureSettings';

export const ChatSettings = () => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Chat Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure your chat experience and appearance.
          </p>
        </div>
        
        <ChatFeatureSettings />
      </div>
    </Card>
  );
};

export default ChatSettings; 