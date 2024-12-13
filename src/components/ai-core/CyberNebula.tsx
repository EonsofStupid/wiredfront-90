import { motion } from "framer-motion";
import { useState } from "react";
import { NeuralParticles } from "../ai-elements/NeuralParticles";

interface CyberNebulaProps {
  onExpand: () => void;
}

export const CyberNebula = ({ onExpand }: CyberNebulaProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-8 right-8 w-64 h-64 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
    >
      <div className="relative w-full h-full">
        {/* Background Orb */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 backdrop-blur-lg"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "45%", "50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Core Orb */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-blue/40 to-neon-pink/40 backdrop-blur-md"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Inner Core */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-tr from-neon-blue/60 to-neon-pink/60 backdrop-blur-sm"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Neural Particles Effect */}
        <NeuralParticles />

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={isHovered ? {
            boxShadow: [
              "0 0 20px rgba(0, 255, 255, 0.3)",
              "0 0 40px rgba(255, 0, 127, 0.3)",
              "0 0 20px rgba(0, 255, 255, 0.3)",
            ],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Center Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white/80"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="text-4xl font-bold gradient-text">AI</div>
        </motion.div>
      </div>
    </motion.div>
  );
};