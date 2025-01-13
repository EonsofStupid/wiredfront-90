import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  console.log("HeroSection rendering");
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
    </section>
  );
};