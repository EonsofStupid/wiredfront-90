import { motion } from "framer-motion";

export const ProcessingRings = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute border border-neon-pink/30 rounded-full"
          style={{
            width: `${(index + 1) * 100}px`,
            height: `${(index + 1) * 100}px`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            delay: index * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};