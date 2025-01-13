import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef } from "react";

export const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex items-center justify-center py-20">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 px-4"
      >
        <div className="neon-border p-8 glass-card mb-8">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6">
            wiredFRONT
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            The future of interface design, today.
          </p>
        </div>

        <Link to="/login">
          <Button className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </motion.div>

      <BackgroundElements />
    </section>
  );
};

const BackgroundElements = () => {
  const prefersReducedMotion = useReducedMotion();
  const animationRef = useRef<Array<{ stop: () => void }>>([]);

  // Cleanup function for animations
  const cleanupAnimations = useCallback(() => {
    animationRef.current.forEach(control => control.stop());
    animationRef.current = [];
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupAnimations();
    };
  }, [cleanupAnimations]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute glass-card neon-glow w-32 h-32"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              x: [0, 20, 0],
              y: [0, 30, 0],
              rotate: [0, 90, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
            onAnimationStart={(definition) => {
              // Store animation control for cleanup
              animationRef.current.push({
                stop: () => {
                  if (definition.stop) definition.stop();
                }
              });
            }}
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};