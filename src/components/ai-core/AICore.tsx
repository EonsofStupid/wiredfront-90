import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CyberNebula } from "./CyberNebula";
import { AITaskPanel } from "./AITaskPanel";
import { AIPersonalityConfig } from "./AIPersonalityConfig";
import { useAIStore } from "@/stores/ai";
import { AIPermissions } from "./AIPermissions";

export const AICore = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNebulaClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <AnimatePresence>
        {!isExpanded && (
          <CyberNebula onExpand={handleNebulaClick} />
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