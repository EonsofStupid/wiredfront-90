
import React from "react";
import { ChatUserSettings } from "@/components/chat/settings/ChatUserSettings";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Admin wrapper for user chat settings
 * This component allows administrators to view and potentially override
 * user chat settings from the admin panel.
 */
export function UserChatSettings() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>User Chat Settings</CardTitle>
        <CardDescription>
          Configure default chat settings for all users
        </CardDescription>
      </CardHeader>
      <ChatUserSettings adminView={true} />
    </Card>
  );
}
