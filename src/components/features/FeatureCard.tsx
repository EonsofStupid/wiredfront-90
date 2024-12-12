import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  capabilities?: string[];
  index: number;
}

export const FeatureCard = ({ icon: Icon, title, description, capabilities, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card-enhanced p-6 md:p-8 group cursor-pointer"
    >
      <div className="text-neon-blue mb-4 transition-transform duration-300 group-hover:scale-110">
        <Icon className="w-8 md:w-10 h-8 md:h-10" />
      </div>
      <h3 className="gradient-text-enhanced text-xl md:text-2xl font-semibold mb-3">
        {title}
      </h3>
      <p className="text-base md:text-lg text-gray-400">{description}</p>
      {capabilities && (
        <ul className="mt-4 space-y-2">
          {capabilities.map((capability, idx) => (
            <li key={idx} className="text-sm text-gray-500 flex items-center interactive-element">
              <span className="w-4 h-4 mr-2 text-neon-pink">•</span>
              {capability}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};