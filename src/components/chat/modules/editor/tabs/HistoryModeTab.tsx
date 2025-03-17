
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, RotateCcw, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HistoryPoint {
  id: string;
  timestamp: Date;
  description: string;
  fileChanges: number;
}

export function HistoryModeTab() {
  // In a real implementation, this would be loaded from a history service
  const [historyPoints] = useState<HistoryPoint[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      description: 'Implemented authentication flow',
      fileChanges: 3
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      description: 'Added form validation',
      fileChanges: 1
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      description: 'Fixed styling issues',
      fileChanges: 2
    },
    {
      id: '4',
      timestamp: new Date(),
      description: 'Current state',
      fileChanges: 0
    }
  ]);
  
  const [selectedPointIndex, setSelectedPointIndex] = useState(historyPoints.length - 1);
  const selectedPoint = historyPoints[selectedPointIndex];

  const handleSliderChange = (value: number[]) => {
    setSelectedPointIndex(value[0]);
  };

  const goToPrevious = () => {
    if (selectedPointIndex > 0) {
      setSelectedPointIndex(selectedPointIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPointIndex < historyPoints.length - 1) {
      setSelectedPointIndex(selectedPointIndex + 1);
    }
  };

  const restoreToPoint = () => {
    // In a real implementation, this would call a restore service
    console.log(`Restoring to history point: ${selectedPoint.id}`);
  };

  return (
    <div className="history-mode-tab space-y-3">
      <div className="text-xs text-white/70 mb-2">
        View and restore previous states of your project.
      </div>

      <div className="relative pt-6 pb-2">
        <Slider
          value={[selectedPointIndex]}
          min={0}
          max={historyPoints.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className="z-10"
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          {historyPoints.map((point, index) => (
            <div 
              key={point.id} 
              className={`h-3 w-3 rounded-full cursor-pointer ${
                index <= selectedPointIndex ? 'bg-chat-neon-blue' : 'bg-white/30'
              }`}
              style={{ left: `calc(${(index / (historyPoints.length - 1)) * 100}% - 6px)` }}
              onClick={() => setSelectedPointIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-white/70">
        <span>{format(historyPoints[0].timestamp, 'HH:mm')}</span>
        <span>Timeline</span>
        <span>{format(historyPoints[historyPoints.length - 1].timestamp, 'HH:mm')}</span>
      </div>

      <Alert className="bg-black/20 border-white/10">
        <AlertDescription className="text-xs text-white/80 flex items-start gap-2">
          <Clock className="h-4 w-4 text-chat-neon-blue shrink-0 mt-0.5" />
          <span>
            <strong className="font-medium text-white">
              {selectedPoint.description}
            </strong>
            <div className="text-white/60 text-[10px] mt-0.5">
              {format(selectedPoint.timestamp, 'MMM d, yyyy HH:mm:ss')} • 
              {selectedPoint.fileChanges} file changes
            </div>
          </span>
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-white/20 text-white"
          onClick={goToPrevious}
          disabled={selectedPointIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-white/20 text-white"
          onClick={goToNext}
          disabled={selectedPointIndex === historyPoints.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto bg-transparent border-chat-neon-blue/50 text-chat-neon-blue"
          onClick={restoreToPoint}
          disabled={selectedPointIndex === historyPoints.length - 1}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restore
        </Button>
      </div>

      <ScrollArea className="h-24 border border-white/10 rounded p-2">
        <div className="space-y-2">
          {/* In a real implementation, this would show the actual file changes */}
          <div className="text-xs text-white/60">
            <div className="font-medium text-white/80">File changes:</div>
            {selectedPoint.fileChanges > 0 ? (
              <ul className="pl-4 mt-1 space-y-1">
                <li className="text-green-400">src/components/Auth.tsx (+24 lines)</li>
                <li className="text-red-400">src/utils/validation.ts (-5 lines)</li>
                <li className="text-yellow-400">src/App.tsx (modified)</li>
              </ul>
            ) : (
              <div className="py-1">Current state - no changes to display</div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
