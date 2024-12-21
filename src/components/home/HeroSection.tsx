import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute glass-card neon-glow w-32 h-32"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 15}%`,
          }}
        />
      ))}
    </div>
  );
};