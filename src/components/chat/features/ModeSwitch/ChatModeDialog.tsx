
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Terminal, Image, MessageSquare, LineChart, BarChart4 } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { ChatMode } from "@/types/chat/enums";

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModeDialog({ open, onOpenChange }: ChatModeDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("mode");
  const { 
    messages, 
    startTime, 
    currentMode, 
    setMode,
    availableProviders
  } = useChatStore();
  
  // Calculated stats
  const messageCount = messages?.length || 0;
  const aiResponses = messages?.filter(m => m.role === 'assistant').length || 0;
  const userMessages = messages?.filter(m => m.role === 'user').length || 0;
  const sessionDuration = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0;
  
  // Code stats
  const codeBlocks = messages?.reduce((count, msg) => {
    const matches = msg.content.match(/```/g);
    return count + (matches ? matches.length / 2 : 0);
  }, 0) || 0;

  // Current page detection
  const isEditorPage = location.pathname === '/editor';
  const isGalleryPage = location.pathname === '/gallery';
  
  // Get current mode based on page
  useEffect(() => {
    if (isEditorPage) {
      setMode(ChatMode.Dev);
    } else if (isGalleryPage) {
      setMode(ChatMode.Image);
    } else if (location.pathname === '/') {
      setMode(ChatMode.Chat);
    }
  }, [isEditorPage, isGalleryPage, setMode, location.pathname]);

  const handleModeChange = (mode: ChatMode) => {
    setMode(mode);
    
    // Navigate to the appropriate page based on mode
    if (mode === ChatMode.Dev) {
      navigate('/editor');
    } else if (mode === ChatMode.Image) {
      navigate('/gallery');
    } else {
      navigate('/');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] bg-black/90 border border-gray-800 text-white shadow-xl shadow-purple-900/20 backdrop-blur-xl"
        style={{ zIndex: 'var(--z-chat-dialogs)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent font-bold">
              Chat Mode Selection
            </span>
            <Badge variant="outline" className="ml-2 bg-gray-900/50 text-xs border-gray-700">
              {currentMode.toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Switch between different AI assistant modes or view session statistics
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="mode" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-900/50">
            <TabsTrigger value="mode" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              Mode Selection
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              Session Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => handleModeChange(ChatMode.Chat)}
                variant={currentMode === ChatMode.Chat ? 'default' : 'outline'}
                className={`flex justify-start items-center p-4 ${currentMode === ChatMode.Chat ? 'bg-gradient-to-r from-blue-500/80 to-violet-500/80 hover:from-blue-500/90 hover:to-violet-500/90' : 'bg-gray-900/50 hover:bg-gray-800/70 border-gray-700'}`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-bold">Chat Mode</p>
                  <p className="text-xs text-gray-400 font-normal">General AI assistance and conversation</p>
                </div>
              </Button>

              <Button 
                onClick={() => handleModeChange(ChatMode.Dev)}
                variant={currentMode === ChatMode.Dev ? 'default' : 'outline'}
                className={`flex justify-start items-center p-4 ${currentMode === ChatMode.Dev ? 'bg-gradient-to-r from-blue-500/80 to-violet-500/80 hover:from-blue-500/90 hover:to-violet-500/90' : 'bg-gray-900/50 hover:bg-gray-800/70 border-gray-700'}`}
              >
                <Terminal className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-bold">Development Mode</p>
                  <p className="text-xs text-gray-400 font-normal">Coding assistance and technical solutions</p>
                </div>
              </Button>

              <Button 
                onClick={() => handleModeChange(ChatMode.Image)}
                variant={currentMode === ChatMode.Image ? 'default' : 'outline'}
                className={`flex justify-start items-center p-4 ${currentMode === ChatMode.Image ? 'bg-gradient-to-r from-blue-500/80 to-violet-500/80 hover:from-blue-500/90 hover:to-violet-500/90' : 'bg-gray-900/50 hover:bg-gray-800/70 border-gray-700'}`}
              >
                <Image className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-bold">Image Generation</p>
                  <p className="text-xs text-gray-400 font-normal">Create and edit images with AI</p>
                </div>
              </Button>
            </div>
            
            {availableProviders && availableProviders.length > 0 ? (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                <p>Available providers: {availableProviders.map(p => p.name).join(', ')}</p>
              </div>
            ) : (
              <div className="text-xs text-amber-500/80 pt-2 border-t border-gray-800">
                <p>No AI providers configured. Please set up API keys in Admin Settings.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <div className="flex items-center mb-1">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm font-semibold">Messages</span>
                </div>
                <p className="text-xl font-bold">{messageCount}</p>
                <div className="text-xs text-gray-400 mt-1 flex flex-col">
                  <span>User: {userMessages}</span>
                  <span>AI: {aiResponses}</span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <div className="flex items-center mb-1">
                  <LineChart className="h-4 w-4 mr-2 text-violet-400" />
                  <span className="text-sm font-semibold">Duration</span>
                </div>
                <p className="text-xl font-bold">{sessionDuration} min</p>
                <div className="text-xs text-gray-400 mt-1">
                  <span>Started: {startTime ? new Date(startTime).toLocaleTimeString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <div className="flex items-center mb-1">
                  <Terminal className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm font-semibold">Code Blocks</span>
                </div>
                <p className="text-xl font-bold">{codeBlocks}</p>
                <div className="text-xs text-gray-400 mt-1">
                  <span>Avg per response: {aiResponses > 0 ? (codeBlocks / aiResponses).toFixed(1) : '0'}</span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <div className="flex items-center mb-1">
                  <BarChart4 className="h-4 w-4 mr-2 text-amber-400" />
                  <span className="text-sm font-semibold">Response Time</span>
                </div>
                <p className="text-xl font-bold">~2.1s</p>
                <div className="text-xs text-gray-400 mt-1">
                  <span>Est. tokens: ~1200</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Session Cost</span>
                <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700">Estimated</Badge>
              </div>
              <p className="text-2xl font-bold text-right">$0.02</p>
              <div className="text-xs text-gray-400 mt-1">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span>{availableProviders?.find(p => p.isDefault)?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Token usage:</span>
                  <span>~2450 tokens</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
