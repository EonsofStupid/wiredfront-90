import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Image, Github, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FilesView } from './views/FilesView';
import { ImagesView } from './views/ImagesView';
import { ProjectsView } from './views/ProjectsView';

interface TopBarExtensionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopBarExtension = ({ isOpen, onClose }: TopBarExtensionProps) => {
  const [activeTab, setActiveTab] = useState<string>('files');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="border-b border-border/40">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Content Manager</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
                  <TabsTrigger value="files" className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Files & Folders
                  </TabsTrigger>
                  <TabsTrigger value="images" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                </TabsList>

                <div className="h-[400px] overflow-y-auto">
                  <TabsContent value="files">
                    <FilesView />
                  </TabsContent>
                  <TabsContent value="images">
                    <ImagesView />
                  </TabsContent>
                  <TabsContent value="projects">
                    <ProjectsView />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};