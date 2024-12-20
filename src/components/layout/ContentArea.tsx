import { motion } from "framer-motion";

export function ContentArea({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="content-area p-6"
    >
      <div className="container mx-auto">
        {children}
      </div>
    </motion.main>
  );
}