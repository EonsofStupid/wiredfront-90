import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DraggableChat } from "@/components/chat/DraggableChat";

const Index = () => {
  return (
    <div className="min-h-full grid-bg">
      <HeroSection />
      <FeaturesSection />
      <DraggableChat />
    </div>
  );
};

export default Index;