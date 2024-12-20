import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const AIPermissions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 mt-4"
    >
      <h3 className="text-xl font-semibold mb-4">Permissions & Security</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">File System Access</Label>
            <p className="text-sm text-gray-400">Allow AI to read and modify files</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">System Control</Label>
            <p className="text-sm text-gray-400">Allow AI to control system functions</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Cloud Sync</Label>
            <p className="text-sm text-gray-400">Sync settings with cloud storage</p>
          </div>
          <Switch />
        </div>
      </div>
    </motion.div>
  );
};