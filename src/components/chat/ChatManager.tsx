
import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useUserChatPreferences } from '@/hooks/useUserChatPreferences';
import { useChatUILayout } from '@/hooks/useChatUILayout';
import { chatSessionsService } from '@/services/chat/chatSessionsService';
import { chatMessagesService } from '@/services/chat/chatMessagesService';
import { initializePresence } from '@/services/chat/userPresenceService';
import { EnhancedChatSession, EnhancedChatMessage } from '@/types/chat-preferences';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export function ChatManager() {
  const { user } = useSupabaseAuth();
  const { preferences } = useUserChatPreferences();
  const { layout } = useChatUILayout();
  const [sessions, setSessions] = useState<EnhancedChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<EnhancedChatSession | null>(null);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Initialize user presence system
  useEffect(() => {
    if (user) {
      const cleanup = initializePresence();
      return cleanup;
    }
  }, [user]);

  // Fetch sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      
      try {
        setIsLoadingSessions(true);
        const fetchedSessions = await chatSessionsService.fetchSessions();
        setSessions(fetchedSessions);
        
        // Set the most recent session as current if available
        if (fetchedSessions.length > 0 && !currentSession) {
          setCurrentSession(fetchedSessions[0]);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        toast.error('Failed to load chat sessions');
      } finally {
        setIsLoadingSessions(false);
      }
    };
    
    loadSessions();
  }, [user, currentSession]);

  // Fetch messages when current session changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSession) return;
      
      try {
        setIsLoadingMessages(true);
        const { messages: fetchedMessages } = await chatMessagesService.fetchMessages(currentSession.id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load chat messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    loadMessages();
  }, [currentSession]);

  // Subscribe to new messages for current session
  useEffect(() => {
    if (!currentSession) return;
    
    const subscription = chatMessagesService.subscribeToMessages(
      currentSession.id,
      (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentSession]);

  // Handle session creation
  const handleCreateSession = async () => {
    try {
      const newSession = await chatSessionsService.createSession({
        title: `Chat ${new Date().toLocaleString()}`,
        mode: 'chat'
      });
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      toast.success('New chat session created');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create new chat session');
    }
  };

  // Handle send message
  const handleSendMessage = async (content: string) => {
    if (!currentSession || !user || !content.trim()) return;
    
    try {
      const message: Omit<EnhancedChatMessage, 'id' | 'created_at' | 'updated_at'> = {
        session_id: currentSession.id,
        user_id: user.id,
        role: 'user',
        content,
        status: 'pending',
        metadata: {}
      };
      
      const sentMessage = await chatMessagesService.sendMessage(message);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <p className="text-lg">Please sign in to use the chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg overflow-hidden bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat</h2>
        <Button onClick={handleCreateSession}>New Chat</Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sessions sidebar */}
        <div className="w-64 border-r p-2 overflow-y-auto">
          <div className="font-medium mb-2">Sessions</div>
          {isLoadingSessions ? (
            <div className="flex justify-center p-4">
              <Spinner />
            </div>
          ) : (
            <ul className="space-y-1">
              {sessions.map(session => (
                <li 
                  key={session.id}
                  className={`
                    p-2 rounded cursor-pointer hover:bg-secondary transition-colors
                    ${currentSession?.id === session.id ? 'bg-secondary' : ''}
                  `}
                  onClick={() => setCurrentSession(session)}
                >
                  {session.title}
                </li>
              ))}
              {sessions.length === 0 && (
                <li className="text-muted-foreground p-2">No sessions yet</li>
              )}
            </ul>
          )}
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentSession ? (
            <>
              <div className="p-2 border-b">
                <h3 className="font-medium">{currentSession.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Mode: {currentSession.mode}
                </p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center p-4">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground p-4">
                        No messages yet. Start a conversation!
                      </div>
                    ) : (
                      messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <div>{message.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at || '').toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    handleSendMessage(input.value);
                    input.value = '';
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="message"
                    className="flex-1 min-w-0 px-3 py-2 border rounded-md"
                    placeholder="Type a message..."
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <p className="text-lg mb-4">Select a chat session or create a new one</p>
              <Button onClick={handleCreateSession}>New Chat</Button>
            </div>
          )}
        </div>
        
        {/* Right sidebar (conditionally shown based on layout) */}
        {layout?.layout?.rightSidebar && layout.layout.rightSidebar.length > 0 && (
          <div className="w-64 border-l p-4">
            <h3 className="font-medium mb-2">Settings</h3>
            <Tabs defaultValue="theme">
              <TabsList className="w-full">
                <TabsTrigger value="theme" className="flex-1">Theme</TabsTrigger>
                <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
              </TabsList>
              <TabsContent value="theme" className="py-2">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // This would use the updatePreferences hook
                      toast.success('Theme updated');
                    }}
                  >
                    Light Mode
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // This would use the updatePreferences hook
                      toast.success('Theme updated');
                    }}
                  >
                    Dark Mode
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="layout" className="py-2">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // This would use the updateLayout hook
                      toast.success('Layout updated');
                    }}
                  >
                    Default Layout
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // This would use the updateLayout hook
                      toast.success('Layout updated');
                    }}
                  >
                    Compact Layout
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
