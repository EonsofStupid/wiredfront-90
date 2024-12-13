import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { Bot, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
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
        <div className="glass-card-enhanced p-4 md:p-8 mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="gradient-text-enhanced text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
              wiredFRONT
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
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
              className="interactive-element glow-effect bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue 
                       border border-neon-blue/50 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                       transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch App
            </Button>
          </Link>
          <HoverCard>
            <HoverCardTrigger>
              <Button 
                className="interactive-element glow-effect bg-dark hover:bg-dark-lighter text-neon-pink 
                         border border-neon-pink/50 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                         transition-all duration-300 hover:scale-105"
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Demo
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="glass-card-enhanced">
              Experience the power of AI-driven workflow automation
            </HoverCardContent>
          </HoverCard>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="w-6 md:w-8 h-6 md:h-8 text-neon-blue animate-pulse" />
      </motion.div>
    </section>
  );
};