
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Sparkles, Grid3X3, Download } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface GalleryChatModuleProps {
  className?: string;
}

export function GalleryChatModule({ className }: GalleryChatModuleProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [stylePreset, setStylePreset] = useState('photographic');
  const [imageCount, setImageCount] = useState<number[]>([1]);
  const [showOptions, setShowOptions] = useState(false);
  const { sendMessage, isLoading } = useMessageAPI();

  const handleGenerateImages = () => {
    if (!prompt.trim()) return;
    
    const fullPrompt = `Generate ${imageCount[0]} image${imageCount[0] > 1 ? 's' : ''} of: ${prompt}
${negativePrompt ? `Negative prompt: ${negativePrompt}` : ''}
Style: ${stylePreset}`;
    
    sendMessage(fullPrompt);
    
    // Don't clear prompt to allow for refinements
  };

  return (
    <div className={`gallery-chat-module ${className || ''}`}>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Image className="h-5 w-5 text-chat-neon-purple" />
          <h3 className="text-sm font-semibold text-white">Image Generation</h3>
        </div>
        
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="min-h-24 bg-black/20 border-white/10 text-white placeholder:text-white/40"
        />
        
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 text-xs text-white/70 hover:text-white hover:bg-white/10 p-0"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? "Hide advanced options" : "Show advanced options"} 
          </Button>
          
          {showOptions && (
            <div className="space-y-3 pt-1 pb-2 px-2 bg-black/10 rounded-md">
              <div>
                <Label className="text-xs text-white/70">Negative prompt</Label>
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Elements to avoid in the image..."
                  className="min-h-16 bg-black/20 border-white/10 text-white placeholder:text-white/40 text-xs"
                />
              </div>
              
              <div>
                <Label className="text-xs text-white/70">Number of images ({imageCount[0]})</Label>
                <Slider 
                  defaultValue={[1]} 
                  max={4} 
                  min={1} 
                  step={1} 
                  value={imageCount}
                  onValueChange={setImageCount}
                />
              </div>
              
              <div>
                <Label className="text-xs text-white/70">Style preset</Label>
                <Select
                  value={stylePreset}
                  onValueChange={setStylePreset}
                >
                  <SelectTrigger className="bg-black/20 border-white/10 text-white text-xs">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 text-white">
                    <SelectItem value="photographic">Photographic</SelectItem>
                    <SelectItem value="digital-art">Digital Art</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="3d-model">3D Model</SelectItem>
                    <SelectItem value="neon-punk">Neon Punk</SelectItem>
                    <SelectItem value="origami">Origami</SelectItem>
                    <SelectItem value="pixel-art">Pixel Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full bg-chat-neon-purple hover:bg-chat-neon-purple/80 gap-2"
          onClick={handleGenerateImages}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate Images
        </Button>
        
        <div className="text-xs text-white/50 text-center">
          Images will appear in the chat where you can save them
        </div>
      </div>
    </div>
  );
}
