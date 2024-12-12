import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader, X, Maximize2, Minimize2, Code, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateGeminiResponse, initializeGemini } from "@/utils/ai/geminiIntegrations";
import { supabase } from "@/integrations/supabase/client";

type AIMode = "chat" | "code" | "file";

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AIMode>("chat");
  const [provider, setProvider] = useState("gemini");
  const { toast } = useToast();

  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Initialize AI providers
        await initializeGemini();
        
        // Load user AI settings from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: settings } = await supabase
            .from('ai_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (settings) {
            setProvider(settings.provider);
          }
        }
      } catch (error) {
        console.error('Error initializing AI:', error);
        toast({
          title: "AI Initialization Error",
          description: "Failed to initialize AI services",
          variant: "destructive",
        });
      }
    };

    initializeAI();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      let result;
      switch (provider) {
        case "gemini":
          result = await generateGeminiResponse(input);
          break;
        // Add other providers here
        default:
          result = "Provider not supported yet";
      }
      
      setResponse(result);
      toast({
        title: "AI Response Generated",
        description: "Response generated successfully",
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getModeIcon = (currentMode: AIMode) => {
    switch (currentMode) {
      case "chat":
        return <Bot className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? "w-auto" : "w-96"
        }`}
      >
        <div className="glass-card neon-border overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-dark-lighter/50">
            <div className="flex items-center gap-2">
              <Wand2 className="text-neon-blue w-5 h-5" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4">
              <Tabs value={mode} onValueChange={(value) => setMode(value as AIMode)} className="mb-4">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Files
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mb-4">
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                    <SelectItem value="huggingface">Hugging Face</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  className="w-full h-24 p-2 rounded-md bg-dark-lighter/30 border border-white/10 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === "chat"
                      ? "Ask me anything..."
                      : mode === "code"
                      ? "Describe the code changes you need..."
                      : "Describe what you want to do with your files..."
                  }
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <>
                      {getModeIcon(mode)}
                      <span className="ml-2">
                        {mode === "chat"
                          ? "Ask AI"
                          : mode === "code"
                          ? "Generate Code"
                          : "Process Files"}
                      </span>
                    </>
                  )}
                </Button>
              </form>

              {response && (
                <div className="mt-4 p-2 rounded-md bg-dark-lighter/30 border border-white/10">
                  <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                    {response}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};