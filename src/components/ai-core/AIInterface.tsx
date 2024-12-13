import { motion } from "framer-motion";
import { useState } from "react";
import { CyberNebula } from "./CyberNebula";
import { AITaskPanel } from "./AITaskPanel";
import { AIPersonalityConfig } from "./AIPersonalityConfig";
import { AIPermissions } from "./AIPermissions";
import { ProcessingRings } from "../ai-elements/ProcessingRings";
import { DataStream } from "../ai-elements/DataStream";

export const AIInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {!isExpanded ? (
        <CyberNebula onExpand={() => setIsExpanded(true)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark/80 backdrop-blur-sm pointer-events-auto"
        >
          <ProcessingRings />
          <DataStream />
          <div className="container mx-auto h-full p-6 flex flex-col">
            <AITaskPanel onClose={() => setIsExpanded(false)} />
            <AIPersonalityConfig />
            <AIPermissions />
          </div>
        </motion.div>
      )}
    </div>
  );
};