import { motion, useReducedMotion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { CodeRainBackground } from "@/components/effects/CodeRainBackground";

export const HeroSection = () => {
  console.log("HeroSection rendering");
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex items-center justify-center py-20 overflow-hidden">
      <CodeRainBackground 
        color="rgba(0, 255, 255, 0.5)"
        fontSize={16}
        density={0.05}
        speed={1.2}
        zIndex={-1}
      />
      
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10 px-4"
      >
        <div className="neon-border enhanced-glass-card p-8 mb-8 relative">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6 enhanced-title relative z-[var(--z-content)]">
            wiredFRONT
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto relative z-[var(--z-content)]">
            The future of interface design, today.
          </p>
        </div>

        <Link to="/login">
          <Button 
            className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 text-lg px-8 py-6 transform hover:scale-115 transition-all duration-300 animate-button-float relative z-[var(--z-content)]"
          >
            Get Started
          </Button>
        </Link>
      </motion.div>

      <BackgroundElements />
    </section>
  );
};

const BackgroundElements = () => {
  console.log("BackgroundElements rendering");
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const [mounted, setMounted] = useState(true);
  const performanceRef = useRef<{ startTime: number; frames: number }>({
    startTime: performance.now(),
    frames: 0
  });

  useEffect(() => {
    console.log("BackgroundElements useEffect running");
    if (prefersReducedMotion) {
      console.log("Reduced motion enabled, skipping animations");
      return;
    }

    const cleanup = () => {
      console.log("BackgroundElements cleanup");
      controls.stop();
      setMounted(false);
    };

    const animate = async () => {
      try {
        console.log("Starting background animation");
        await controls.start({
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.6, 0.3],
          transition: {
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }
        });
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    animate();

    const monitorPerformance = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - performanceRef.current.startTime;
      performanceRef.current.frames++;
      
      if (elapsed >= 1000) {
        const fps = Math.round((performanceRef.current.frames * 1000) / elapsed);
        console.log(`Background Animation FPS: ${fps}`);
        performanceRef.current = {
          startTime: currentTime,
          frames: 0
        };
      }
      
      if (mounted) {
        requestAnimationFrame(monitorPerformance);
      }
    };

    requestAnimationFrame(monitorPerformance);

    return cleanup;
  }, [prefersReducedMotion, controls, mounted]);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute glass-card neon-glow w-32 h-32 transform"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={controls}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 20}%`,
              transform: `translate3d(0, 0, 0)`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
