import { motion } from "framer-motion";
import { features } from "@/config/features";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeatureCard } from "@/components/features/FeatureCard";
import { NeuralParticles } from "@/components/ai-elements/NeuralParticles";
import { ProcessingRings } from "@/components/ai-elements/ProcessingRings";
import { DataStream } from "@/components/ai-elements/DataStream";

const Index = () => {
  return (
    <div className="min-h-screen grid-bg">
      <NeuralParticles />
      <ProcessingRings />
      <DataStream />
      
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="gradient-text-enhanced text-3xl md:text-4xl font-bold mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Seamlessly integrate AI capabilities into your workflow with our powerful features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;