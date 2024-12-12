import { motion } from "framer-motion";

export const DataStream = () => {
  const characters = "10".split("");
  
  return (
    <div className="absolute right-0 top-0 h-full w-1/4 pointer-events-none overflow-hidden opacity-20">
      {[...Array(10)].map((_, lineIndex) => (
        <motion.div
          key={lineIndex}
          className="absolute text-neon-blue"
          style={{
            left: `${lineIndex * 10}%`,
            top: "-20px",
          }}
          initial={{ y: -100 }}
          animate={{ y: "100vh" }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        >
          {[...Array(20)].map((_, charIndex) => (
            <div key={charIndex} className="my-1">
              {characters[Math.floor(Math.random() * characters.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};