
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  GitHub, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Info, 
  Loader2, 
  GitBranch,
  Server,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SettingsContainer } from "../layout/SettingsContainer";

interface GithubMetrics {
  remaining: number;
  limit: number;
  resetTime: string;
  lastChecked: string;
}

interface GithubTokenProps {
  githubToken: string;
  dockerToken: string;
  onGithubTokenChange: (value: string) => void;
  onDockerTokenChange: (value: string) => void;
}

export function DevelopmentSettings({
  githubToken,
  dockerToken,
  onGithubTokenChange,
  onDockerTokenChange
}: GithubTokenProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState<GithubMetrics | null>(null);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [newGithubToken, setNewGithubToken] = useState("");
  const [newDockerToken, setNewDockerToken] = useState("");

  const validateGithubToken = async (token: string) => {
    if (!token) {
      toast.error("Please enter a GitHub token");
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setIsValid(true);
        setGithubUsername(userData.login);

        // Get rate limit info
        const rateLimitResponse = await fetch('https://api.github.com/rate_limit', {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (rateLimitResponse.ok) {
          const rateLimitData = await rateLimitResponse.json();
          const resetDate = new Date(rateLimitData.resources.core.reset * 1000);
          
          setMetrics({
            remaining: rateLimitData.resources.core.remaining,
            limit: rateLimitData.resources.core.limit,
            resetTime: resetDate.toLocaleTimeString(),
            lastChecked: new Date().toLocaleTimeString()
          });
        }

        toast.success("GitHub token is valid");
      } else {
        setIsValid(false);
        toast.error("Invalid GitHub token");
      }
    } catch (error) {
      console.error("Error validating GitHub token:", error);
      setIsValid(false);
      toast.error("Failed to validate GitHub token");
    } finally {
      setIsValidating(false);
    }
  };

  const saveGithubToken = async () => {
    if (!newGithubToken) {
      toast.error("Please enter a GitHub token");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'create',
          provider: 'github',
          memorableName: 'primary_github_token',
          secretValue: newGithubToken,
          settings: {
            feature_bindings: ['code_generation', 'repository_access', 'github_sync']
          }
        }
      });

      if (error) throw error;
      
      toast.success("GitHub token saved successfully");
      onGithubTokenChange(newGithubToken);
      setNewGithubToken("");
    } catch (error) {
      console.error("Error saving GitHub token:", error);
      toast.error("Failed to save GitHub token");
    } finally {
      setIsSaving(false);
    }
  };

  const syncGithubMetrics = async () => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-secret', {
        body: {
          action: 'sync_github_metrics'
        }
      });

      if (error) throw error;
      
      toast.success("GitHub metrics synced successfully");
      
      // Update local state based on response
      if (data?.results && data.results.length > 0) {
        const result = data.results.find(r => r.status === 'synced');
        if (result) {
          setMetrics({
            remaining: result.metrics.remaining,
            limit: result.metrics.limit,
            resetTime: new Date(result.metrics.reset).toLocaleTimeString(),
            lastChecked: new Date().toLocaleTimeString()
          });
        }
      }
    } catch (error) {
      console.error("Error syncing GitHub metrics:", error);
      toast.error("Failed to sync GitHub metrics");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <SettingsContainer
      title="Development Integrations"
      description="Manage development tokens for GitHub, Docker, and other services"
    >
      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="github" className="flex items-center gap-2">
            <GitHub className="h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="docker" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Docker
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="github" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <GitHub className="h-5 w-5" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Connect your GitHub account to enable repository access and code generation
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {githubToken ? (
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        GitHub Connected
                        {githubUsername && <span className="text-sm">({githubUsername})</span>}
                      </h4>
                      
                      {metrics && (
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                              <span>Remaining API calls:</span>
                              <span className={metrics.remaining < 100 ? "text-destructive font-bold" : ""}>
                                {metrics.remaining}/{metrics.limit}
                              </span>
                            </Badge>
                            
                            <Badge variant="outline" className="gap-1">
                              <span>Resets at:</span>
                              <span>{metrics.resetTime}</span>
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Last checked: {metrics.lastChecked}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={syncGithubMetrics}
                      disabled={isValidating}
                    >
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="ml-2">Refresh</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Repository Access</h4>
                      <p className="text-sm text-muted-foreground">
                        GitHub token is used for repository operations
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => validateGithubToken(githubToken)}
                      >
                        <GitBranch className="h-3.5 w-3.5" />
                        Test Access
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        GitHub Not Connected
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Add a GitHub token to enable repository access
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        placeholder="Enter your GitHub personal access token"
                        value={newGithubToken}
                        onChange={(e) => setNewGithubToken(e.target.value)}
                      />
                      
                      <Button
                        onClick={() => validateGithubToken(newGithubToken)}
                        disabled={isValidating || !newGithubToken}
                        variant="outline"
                      >
                        {isValidating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Validate
                      </Button>
                    </div>
                    
                    <p className="text-xs flex items-center text-muted-foreground">
                      <Info className="h-3 w-3 mr-1" />
                      Token needs 'repo' scope for full repository access
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-2">
              {!githubToken && (
                <Button
                  onClick={saveGithubToken}
                  disabled={isSaving || !isValid}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <GitHub className="h-4 w-4 mr-2" />
                      Save GitHub Token
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="docker" className="space-y-4 pt-4">
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
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connections
              </CardTitle>
              <CardDescription>
                Manage database connection strings for development
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="p-8 text-center border rounded-md">
                <Database className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Database connection management coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsContainer>
  );
}
