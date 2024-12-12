import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  ChevronDown, 
  Sparkles, 
  FileCode, 
  Bot, 
  Layers,
  Workflow,
  Shield,
  Cpu,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/50 to-dark" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-4xl"
        >
          <div className="neon-border p-4 md:p-8 glass-card mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl md:text-8xl'} font-bold gradient-text mb-6`}>
                wiredFRONT
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
                <span className="text-lg md:text-2xl text-neon-pink">AI-Powered Workspace</span>
              </div>
              <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
                Transform your workflow with AI-driven file management, automation, and seamless integrations.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button 
                className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 
                         text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                         transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch App
              </Button>
            </Link>
            <HoverCard>
              <HoverCardTrigger>
                <Button 
                  variant="outline"
                  className="neon-glow bg-dark hover:bg-dark-lighter text-neon-pink border border-neon-pink/50
                           text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                           transition-all duration-300 hover:scale-105"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Try AI Demo
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="glass-card">
                Experience the power of AI-driven workflow automation
              </HoverCardContent>
            </HoverCard>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute glass-card neon-glow w-16 md:w-32 h-16 md:h-32"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
                rotate: [0, 180, 0],
                scale: [1, 1.1, 1],
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

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 md:w-8 h-6 md:h-8 text-neon-blue animate-pulse" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Seamlessly integrate AI capabilities into your workflow with our powerful features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 md:p-8 group cursor-pointer"
            >
              <div className="text-neon-blue mb-4 transition-transform duration-300 group-hover:scale-110">
                {<feature.icon className="w-8 md:w-10 h-8 md:h-10" />}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 gradient-text">
                {feature.title}
              </h3>
              <p className="text-base md:text-lg text-gray-400">{feature.description}</p>
              {feature.capabilities && (
                <ul className="mt-4 space-y-2">
                  {feature.capabilities.map((capability, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-neon-pink" />
                      {capability}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Bot,
    title: "AI Integration",
    description: "Powerful AI capabilities at your fingertips",
    capabilities: [
      "OpenAI & Hugging Face integration",
      "Custom model support",
      "Real-time AI assistance"
    ]
  },
  {
    icon: FileCode,
    title: "Smart Files",
    description: "Intelligent file management and automation",
    capabilities: [
      "AI-powered organization",
      "Automated workflows",
      "Smart tagging system"
    ]
  },
  {
    icon: Layers,
    title: "Modular Design",
    description: "Customize your workspace your way",
    capabilities: [
      "Plug-and-play modules",
      "Custom script support",
      "Flexible layouts"
    ]
  },
  {
    icon: Workflow,
    title: "Automation",
    description: "Streamline your workflow with AI",
    capabilities: [
      "Task automation",
      "Process optimization",
      "Custom workflows"
    ]
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade security built-in",
    capabilities: [
      "End-to-end encryption",
      "Role-based access",
      "Secure AI processing"
    ]
  },
  {
    icon: Cpu,
    title: "Performance",
    description: "Optimized for heavy workloads",
    capabilities: [
      "Real-time processing",
      "Efficient resource usage",
      "Scalable architecture"
    ]
  }
];

export default Index;