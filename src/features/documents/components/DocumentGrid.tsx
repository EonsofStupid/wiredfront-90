import React from 'react';
import { useDocumentStore } from '@/features/documents/stores/documentStore';
import { Card } from '@/components/ui/card';
import { FileText, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

export const DocumentGrid = () => {
  const { documents, loading } = useDocumentStore();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse glass-card">
            <div className="h-32 bg-dark-lighter/30" />
            <div className="h-8 mt-2 bg-dark-lighter/30" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      {documents.map((doc) => (
        <motion.div
          key={doc.id}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <Card className="glass-card hover:border-neon-pink/50 transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {doc.category ? (
                  <Folder className="h-5 w-5 text-neon-blue" />
                ) : (
                  <FileText className="h-5 w-5 text-neon-pink" />
                )}
                <h3 className="text-lg font-semibold truncate gradient-text">
                  {doc.title}
                </h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground/70">
                  {new Date(doc.created_at || '').toLocaleDateString()}
                </p>
                {doc.author && (
                  <p className="text-sm text-foreground/70">
                    Author: {doc.author}
                  </p>
                )}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-dark-lighter/30 border border-neon-blue/20 text-neon-blue"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};