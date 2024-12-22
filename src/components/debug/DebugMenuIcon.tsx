import { useState } from 'react';
import { Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CacheMetricsPanel } from './CacheMetricsPanel';

export const DebugMenuIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-neon-pink hover:text-neon-blue"
        title="Debug Menu"
      >
        <Database className="h-5 w-5" />
      </Button>
      {isOpen && <CacheMetricsPanel />}
    </>
  );
};