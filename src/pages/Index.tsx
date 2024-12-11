import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, Activity, Code, Database, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HighlightedText } from "@/components/ui/highlighted-text";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen grid-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/50 to-dark" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4"
        >
          <div className="neon-border p-8 glass-card mb-8">
            <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6">
              <HighlightedText text="wiredFRONT" />
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

        {/* Floating Elements */}
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

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-neon-blue animate-pulse" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-neon-blue mb-4">{<feature.icon className="w-8 h-8" />}</div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

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

export default Index;
