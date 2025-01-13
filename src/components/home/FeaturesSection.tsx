import { motion, useReducedMotion } from "framer-motion";
import { Activity, Code, Database, Settings } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Advanced Editor",
    description: "Next-gen code editing with real-time collaboration.",
  },
  {
    icon: Activity,
    title: "Live Analytics",
    description: "Real-time performance monitoring and insights.",
  },
  {
    icon: Database,
    title: "Smart Storage",
    description: "Intelligent data management and version control.",
  },
  {
    icon: Settings,
    title: "Full Control",
    description: "Customizable workspace and powerful integrations.",
  },
];

export const FeaturesSection = () => {
  console.log("FeaturesSection rendering");
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          console.log(`Rendering feature: ${feature.title}`);
          return (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-neon-blue mb-4">
                {<feature.icon className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};