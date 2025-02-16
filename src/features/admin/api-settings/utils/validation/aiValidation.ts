
import { AIConfiguration } from "../../types/providers/ai";
import { ValidationStatusType } from "@/integrations/supabase/types";

export async function validateAIConfiguration(config: AIConfiguration): Promise<ValidationStatusType> {
  try {
    const response = await fetch('https://deksjwrdczcsnryjohzg.supabase.co/functions/v1/test-ai-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.provider_settings.api_key}`,
      },
      body: JSON.stringify({
        provider: config.api_type,
        config: config.provider_settings,
      }),
    });

    if (!response.ok) {
      throw new Error('Validation failed');
    }

    return 'valid';
  } catch (error) {
    console.error('Error validating AI configuration:', error);
    return 'invalid';
  }
}
