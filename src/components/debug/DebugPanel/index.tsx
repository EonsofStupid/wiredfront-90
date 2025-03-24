import { cn } from "@/lib/utils";
import { DebugMetrics } from "./DebugMetrics";

interface DebugPanelProps {
  className?: string;
}

export const DebugPanel = ({ className }: DebugPanelProps) => {
  return (
    <div
      className={cn(
        "fixed bottom-16 left-4 right-4 bg-dark-lighter/95 border border-neon-blue/20 rounded-lg p-4 shadow-lg",
        "backdrop-blur-sm z-[9999]"
      )}
      data-zlayer={`debug-panel (z: 9999)`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer Visualization */}
        <div className="space-y-4">
          <h3 className="text-neon-blue font-bold">Layer Visualization</h3>
          <div className="space-y-2 text-sm">
            <p className="text-neon-pink">Z-Index Values:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Modal: var(--z-modal) = 1000</li>
              <li>Dropdown: var(--z-dropdown) = 100</li>
              <li>Tooltip: var(--z-tooltip) = 50</li>
              <li>Header: var(--z-header) = 40</li>
              <li>Footer: var(--z-footer) = 30</li>
              <li>Content: var(--z-content) = 1</li>
            </ul>
            <p className="text-green-400 mt-2">Stacking Contexts (green)</p>
            <p className="text-blue-400">Fixed/Absolute Elements (blue)</p>
            <p className="text-magenta-400">Z-Index Values (magenta)</p>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-neon-blue font-bold mb-4">Performance Metrics</h3>
          <DebugMetrics />
        </div>
      </div>
    </div>
  );
};
