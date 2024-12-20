import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const AIPersonalityConfig = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 mt-4"
    >
      <h3 className="text-xl font-semibold mb-4">AI Personality Settings</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Friendliness</Label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Assertiveness</Label>
          <Slider
            defaultValue={[30]}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Technical Detail Level</Label>
          <Slider
            defaultValue={[70]}
            max={100}
            step={1}
          />
        </div>
      </div>
    </motion.div>
  );
};