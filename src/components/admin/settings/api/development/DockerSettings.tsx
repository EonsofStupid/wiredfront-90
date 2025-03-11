
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Server } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface DockerSettingsProps {
  dockerToken: string;
  onDockerTokenChange: (value: string) => void;
}

export function DockerSettings({ dockerToken, onDockerTokenChange }: DockerSettingsProps) {
  const [newDockerToken, setNewDockerToken] = useState("");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Docker Registry
        </CardTitle>
        <CardDescription>
          Connect to Docker registry for container operations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your Docker registry token"
            value={newDockerToken}
            onChange={(e) => setNewDockerToken(e.target.value)}
          />
          
          <p className="text-xs flex items-center text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            Used for pushing and pulling containers to Docker registries
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={() => {
            onDockerTokenChange(newDockerToken);
            setNewDockerToken("");
            toast.success("Docker token saved");
          }}
          className="w-full"
          disabled={!newDockerToken}
        >
          <Server className="h-4 w-4 mr-2" />
          Save Docker Token
        </Button>
      </CardFooter>
    </Card>
  );
}
