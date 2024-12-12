import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AISwirl } from "./AISwirl";
import { AITaskPanel } from "./AITaskPanel";
import { AIPersonalityConfig } from "./AIPersonalityConfig";
import { useAIStore } from "@/stores/ai";
import { AIPermissions } from "./AIPermissions";

export const AICore = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleSwirlClick = () => {
    setIsExpanded(!isExpanded);
  };

  const updateSwirlPosition = (e: MouseEvent) => {
    if (!isExpanded) {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', updateSwirlPosition);
    return () => window.removeEventListener('mousemove', updateSwirlPosition);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50"
            style={{
              left: position.x - 25,
              top: position.y - 25,
            }}
          >
            <AISwirl onClick={handleSwirlClick} />
          </motion.div>
        )}

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm"
          >
            <div className="container mx-auto h-full p-6 flex flex-col">
              <AITaskPanel onClose={() => setIsExpanded(false)} />
              <AIPersonalityConfig />
              <AIPermissions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};