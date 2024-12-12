import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const NeuralParticles = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-neon-blue/30 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
};