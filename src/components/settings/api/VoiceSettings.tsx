import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VoiceSettingsProps {
  elevenLabsKey: string;
  onElevenLabsKeyChange: (value: string) => void;
  selectedVoice: string;
  onVoiceChange: (value: string) => void;
}

export function VoiceSettings({
  elevenLabsKey,
  onElevenLabsKeyChange,
  selectedVoice,
  onVoiceChange,
}: VoiceSettingsProps) {
  const voices = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
    { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
    { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
    { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ElevenLabs Voice API</CardTitle>
          <CardDescription>
            Configure ElevenLabs for text-to-speech capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="elevenlabs-key">API Key</Label>
            <Input
              id="elevenlabs-key"
              type="password"
              value={elevenLabsKey}
              onChange={(e) => onElevenLabsKeyChange(e.target.value)}
              placeholder="Enter ElevenLabs API key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voice-select">Default Voice</Label>
            <Select value={selectedVoice} onValueChange={onVoiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Get your API key from the{" "}
            <a
              href="https://elevenlabs.io/subscription"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ElevenLabs dashboard
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}