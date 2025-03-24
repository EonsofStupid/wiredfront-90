import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
  };
  renderTime: number;
  components: number;
}

export const DebugMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: { used: 0, total: 0 },
    renderTime: 0,
    components: 0,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lastRenderTime = performance.now();

    const updateMetrics = () => {
      const now = performance.now();
      const delta = now - lastTime;

      // Calculate FPS
      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
      }

      // Calculate render time
      const renderTime = now - lastRenderTime;
      setMetrics((prev) => ({ ...prev, renderTime }));

      // Get memory usage if available
      if (performance.memory) {
        const memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        };
        setMetrics((prev) => ({ ...prev, memory }));
      }

      // Count mounted components
      const componentCount = document.querySelectorAll("[data-zlayer]").length;
      setMetrics((prev) => ({ ...prev, components: componentCount }));

      frameCount++;
      lastRenderTime = now;
      requestAnimationFrame(updateMetrics);
    };

    const animationFrame = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <p className="text-neon-pink">FPS</p>
          <p
            className={cn(
              "font-mono",
              metrics.fps >= 60
                ? "text-green-400"
                : metrics.fps >= 30
                ? "text-yellow-400"
                : "text-red-400"
            )}
          >
            {metrics.fps}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-neon-pink">Render Time</p>
          <p
            className={cn(
              "font-mono",
              metrics.renderTime < 16
                ? "text-green-400"
                : metrics.renderTime < 32
                ? "text-yellow-400"
                : "text-red-400"
            )}
          >
            {metrics.renderTime.toFixed(2)}ms
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-neon-pink">Memory Usage</p>
        <p className="font-mono text-blue-400">
          {metrics.memory.used}MB / {metrics.memory.total}MB
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-neon-pink">Mounted Components</p>
        <p className="font-mono text-purple-400">{metrics.components}</p>
      </div>
    </div>
  );
};
