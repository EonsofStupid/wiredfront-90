import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate content loading and prevent animation jank
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

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

        <Link to="/dashboard">
          <Button className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 text-lg px-8 py-6">
            Launch Dashboard
          </Button>
        </Link>
      </motion.div>

      <BackgroundElements />
    </section>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-8">
    <Skeleton className="h-32 w-3/4 max-w-2xl" />
    <Skeleton className="h-16 w-48" />
  </div>
);

const BackgroundElements = () => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Limit to 3 background elements for better performance
  return (
    <div className="absolute inset-0 pointer-events-none">
      {mounted && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute glass-card neon-glow w-32 h-32"
          initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={
            prefersReducedMotion 
              ? { opacity: 1 }
              : {
                  x: [0, 20, 0],
                  y: [0, 30, 0],
                  rotate: [0, 90, 0],
                }
          }
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
          style={{
            left: `${30 + i * 20}%`,
            top: `${20 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
};