
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIType } from '@/types/admin/settings/api';
import { useAPIKeyManagement } from '@/hooks/admin/settings/api/useAPIKeyManagement';
import { APIConfigStepProps } from './APIConfigStepTypes';

export const APIConfigStep: React.FC<APIConfigStepProps> = ({ onNext, onBack, isFirstTimeUser }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createApiKey } = useAPIKeyManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openaiKey) return;

    setIsSubmitting(true);
    try {
      await createApiKey(
        'openai' as APIType, // Fix: Add type assertion
        'Primary OpenAI Key',
        openaiKey,
        {
          feature_bindings: ['chat', 'embeddings'],
          rag_preference: 'supabase',
          planning_mode: 'basic'
        },
        ['user', 'developer', 'admin'],
        []
      );
      onNext();
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <Label htmlFor="openaiKey">OpenAI API Key</Label>
        <Input
          id="openaiKey"
          type="password"
          placeholder="sk-..."
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Next'}
        </Button>
      </div>
    </form>
  );
};
