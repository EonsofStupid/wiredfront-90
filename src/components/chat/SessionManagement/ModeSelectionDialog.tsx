import React, { useState, useEffect, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useChatStore } from "../store/chatStore";

export type ChatMode = "chat" | "dev" | "image" | "training";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (mode: ChatMode, providerId: string) => void;
}

export function ModeSelectionDialog({ open, onOpenChange, onCreateSession }: Props) {
  const [selectedMode, setSelectedMode] = useState<ChatMode>("chat");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const { providers } = useChatStore();
  
  const providersForMode = useMemo(() => {
    // Return an empty array with proper fallback if providers.availableProviders doesn't exist
    if (!providers || !providers.availableProviders) {
      return [];
    }
    
    return providers.availableProviders.filter(
      (p) => p.supportedModes?.includes(selectedMode)
    );
  }, [selectedMode, providers]);

  // Set default provider when providers change
  useEffect(() => {
    const defaultProvider = providersForMode.find((p) => p.isDefault);
    if (defaultProvider) {
      setSelectedProvider(defaultProvider.id);
    } else if (providersForMode.length > 0) {
      setSelectedProvider(providersForMode[0].id);
    }
  }, [providersForMode]);

  const handleCreateSession = () => {
    if (selectedMode && selectedProvider) {
      onCreateSession(selectedMode, selectedProvider);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Select Chat Mode</AlertDialogTitle>
          <AlertDialogDescription>
            Choose the mode for your new chat session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Mode</Label>
            <RadioGroup
              defaultValue={selectedMode}
              onValueChange={(value) => setSelectedMode(value as ChatMode)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chat" id="chat" />
                <Label htmlFor="chat">Chat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dev" id="dev" />
                <Label htmlFor="dev">Developer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="training" id="training" />
                <Label htmlFor="training">Training</Label>
              </div>
            </RadioGroup>
          </div>
          {providersForMode.length > 0 && (
            <div className="space-y-2">
              <Label>Provider</Label>
              <RadioGroup
                defaultValue={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <div className="flex flex-col space-y-2">
                  {providersForMode.map((provider) => (
                    <div key={provider.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={provider.id} id={provider.id} />
                      <Label htmlFor={provider.id}>{provider.name}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateSession}>
            Create Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
