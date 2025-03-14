
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Mobile-optimized editor experience
 */
export const MobileEditor = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full bg-dark-lighter border border-neon-blue/20">
          <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          <TabsTrigger value="output" className="flex-1">Output</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="mt-4">
          <div className="p-4 rounded-lg bg-dark-lighter border border-neon-blue/20">
            <pre className="text-xs font-mono text-white overflow-x-auto">
              <code>
{`// Example code
import React from "react";

export const HelloWorld = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Hello, Mobile!
      </h1>
    </div>
  );
};`}
              </code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="p-4 rounded-lg bg-dark-lighter border border-neon-blue/20">
            <div className="p-4 bg-black/30 rounded">
              <h1 className="text-xl font-bold">Hello, Mobile!</h1>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="mt-4">
          <div className="p-4 rounded-lg bg-dark-lighter border border-neon-blue/20">
            <div className="font-mono text-xs text-green-400">
              ✓ Compiled successfully!
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
