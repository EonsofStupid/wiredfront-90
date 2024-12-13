import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateAIResponse } from "@/utils/ai/aiProviders";
import { AIHeader } from "./AIHeader";
import { AIModeSelector } from "./AIModeSelector";
import { AIProviderSelector } from "./AIProviderSelector";
import { AIInputForm } from "./AIInputForm";
import { AIResponse } from "./AIResponse";
import type { AIMode, AIProvider } from "@/types/ai";

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AIMode>("chat");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const { toast } = useToast();

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: settings } = await supabase
            .from('ai_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (settings) {
            setProvider(settings.provider as AIProvider);
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };

    loadUserSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      const result = await generateAIResponse(provider, input);
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
          <AIHeader
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
          />

          {!isMinimized && (
            <div className="p-4">
              <AIModeSelector mode={mode} onModeChange={(value) => setMode(value)} />
              <AIProviderSelector
                provider={provider}
                onProviderChange={(value) => setProvider(value)}
              />
              <AIInputForm
                input={input}
                mode={mode}
                isProcessing={isProcessing}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
              <AIResponse response={response} />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};