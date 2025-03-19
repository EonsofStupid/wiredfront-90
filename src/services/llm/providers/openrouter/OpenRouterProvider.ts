
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { BaseProvider } from '../base/BaseProvider';
import { ChatOptions } from '@/types/providers/provider-types';

export class OpenRouterProvider extends BaseProvider {
  constructor() {
    super('openrouter-default', 'OpenRouter', 'openrouter', 'chat');
    
    // Set OpenRouter specific capabilities
    this.capabilities = {
      chat: true,
      image: false,
      dev: true,
      voice: false,
      streaming: true,
      rag: true
    };
    
    // Set default model and configuration
    this.config = {
      apiKey: null,
      modelName: 'openai/gpt-4o',
      options: {
        temperature: 0.7,
        maxTokens: 1000
      }
    };
  }
  
  async generateText(prompt: string, options: ChatOptions = {}): Promise<string> {
    try {
      if (!this.config.apiKey) {
        await this.initialize();
        if (!this.config.apiKey) {
          return "Error: OpenRouter API key not configured. Please set OPENROUTER_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to OpenRouter
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'openrouter',
          prompt,
          options: {
            model: options.modelName || this.config.modelName,
            temperature: options.temperature || this.config.options.temperature,
            max_tokens: options.maxTokens || this.config.options.maxTokens,
            systemPrompt: options.systemPrompt || 'You are a helpful assistant.',
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with OpenRouter', error);
        return `Error generating text: ${error.message}`;
      }
      
      // Track the usage
      if (data?.usage) {
        this.trackUsage(
          'text_generation', 
          data.usage.total_tokens || 0, 
          (data.usage.total_tokens || 0) * 0.00001 // Approximate cost calculation
        );
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with OpenRouter', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // OpenRouter works with various models, so we use a generic format
    const system = context.system || "You are a helpful assistant.";
    
    let enhancedPrompt = prompt;
    
    if (system) {
      enhancedPrompt = `${system}\n\n${prompt}`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `[Document ${index + 1}]: ${doc.content}`
    );
    
    return `
I need information to answer the following query: "${query}"

Here is the relevant context information:
${contextChunks.join('\n\n')}

Based on the above context, please help with the query.
`;
  }
  
  async generateCode(prompt: string, options: any = {}): Promise<string> {
    // For code generation, we use the same API but add code-specific instructions
    const codePrompt = `Generate code for: ${prompt}

Please follow these guidelines:
- Write clean, well-commented code
- Follow best practices for the language
- Include any necessary imports or setup
- Explain any complex logic
`;

    return this.generateText(codePrompt, {
      systemPrompt: "You are an expert software developer. Provide only code implementations with minimal explanations. Focus on writing clean, efficient, and well-documented code.",
      temperature: 0.3, // Lower temperature for more deterministic code generation
      ...options
    });
  }
}
