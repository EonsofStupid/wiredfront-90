import { motion, useReducedMotion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

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
  const controls = useAnimation();
  const [mounted, setMounted] = useState(true);
  const performanceRef = useRef<{ startTime: number; frames: number }>({
    startTime: performance.now(),
    frames: 0
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const cleanup = () => {
      controls.stop();
      setMounted(false);
    };

    const animate = async () => {
      try {
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

    // Performance monitoring
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
              transform: `translate3d(0, 0, 0)` // Force GPU acceleration
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const FeaturesSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const controls = useAnimation();
  const performanceRef = useRef<{ startTime: number; frames: number }>({
    startTime: performance.now(),
    frames: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = featuresRef.current.findIndex(ref => ref === entry.target);
          if (entry.isIntersecting && !visibleItems.includes(index)) {
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    featuresRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Performance monitoring
    const monitorPerformance = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - performanceRef.current.startTime;
      performanceRef.current.frames++;
      
      if (elapsed >= 1000) {
        const fps = Math.round((performanceRef.current.frames * 1000) / elapsed);
        console.log(`Features Animation FPS: ${fps}`);
        performanceRef.current = {
          startTime: currentTime,
          frames: 0
        };
      }
      
      requestAnimationFrame(monitorPerformance);
    };

    requestAnimationFrame(monitorPerformance);

    return () => {
      observer.disconnect();
      controls.stop();
    };
  }, [controls, visibleItems]);

  const features = [
    {
      icon: "Code",
      title: "Advanced Editor",
      description: "Next-gen code editing with real-time collaboration.",
    },
    {
      icon: "Activity",
      title: "Live Analytics",
      description: "Real-time performance monitoring and insights.",
    },
    {
      icon: "Database",
      title: "Smart Storage",
      description: "Intelligent data management and version control.",
    },
    {
      icon: "Settings",
      title: "Full Control",
      description: "Customizable workspace and powerful integrations.",
    },
  ];

  return (
    <ErrorBoundary>
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={el => featuresRef.current[index] = el}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={visibleItems.includes(index) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 transform"
            >
              <div className="text-neon-blue mb-4">
                {/* Dynamic icon import */}
                <span className="w-8 h-8 block">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};