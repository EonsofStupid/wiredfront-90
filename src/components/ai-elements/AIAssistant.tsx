import { useState, useRef } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  const handleDragEnd = (_e: any, info: any) => {
    setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
  };

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
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            left: 0,
            right: window.innerWidth - 400, // Adjust based on assistant width
            bottom: window.innerHeight - 600, // Adjust based on assistant height
          }}
          dragElastic={0}
          onDragEnd={handleDragEnd}
          animate={{
            x: position.x,
            y: position.y,
          }}
          className={`fixed bottom-8 right-8 w-96 pointer-events-auto z-50
            ${isMinimized ? 'h-auto' : 'h-[600px]'}`}
        >
          <div className="ai-assistant glass-card neon-border w-full h-full overflow-hidden rounded-lg shadow-xl">
            <div className="cursor-move bg-dark-lighter/30 hover:bg-dark-lighter/50 h-6" />
            
            <AIHeader
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onClose={() => setIsOpen(false)}
            />

            {!isMinimized && (
              <div className="p-4 space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
                <AIModeSelector mode={mode} onModeChange={setMode} />
                <AIProviderSelector
                  provider={provider}
                  onProviderChange={setProvider}
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
    </div>
  );
};