import { useState, useEffect, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
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
    <motion.div ref={constraintsRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`ai-assistant pointer-events-auto ${isMinimized ? 'ai-assistant--minimized' : ''} ${
            isDragging ? 'ai-assistant--dragging' : ''
          }`}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: isMinimized ? 'auto' : '24rem',
          }}
        >
          <div className="ai-assistant__container">
            <div className="ai-assistant__handle" />
            <AIHeader
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onClose={() => setIsOpen(false)}
            />

            {!isMinimized && (
              <div className="ai-assistant__content">
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
    </motion.div>
  );
};