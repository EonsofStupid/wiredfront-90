
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { BaseProvider } from '../base/BaseProvider';
import { ChatOptions } from '@/types/providers/provider-types';

export class AnthropicProvider extends BaseProvider {
  constructor() {
    super('anthropic-default', 'Anthropic Claude', 'anthropic', 'chat');
    
    // Set Anthropic specific capabilities
    this.capabilities = {
      chat: true,
      image: false,  // No native image generation
      dev: true,     // Good for code tasks
      voice: false,  // No native voice support
      streaming: true,
      rag: true
    };
    
    // Set default model and configuration
    this.config = {
      apiKey: null,
      modelName: 'claude-3-opus-20240229',
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
          return "Error: Anthropic API key not configured. Please set ANTHROPIC_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Anthropic
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'anthropic',
          prompt,
          options: {
            model: options.modelName || this.config.modelName,
            temperature: options.temperature || this.config.options.temperature,
            max_tokens: options.maxTokens || this.config.options.maxTokens,
            systemPrompt: options.systemPrompt || '',
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with Anthropic', error);
        return `Error generating text: ${error.message}`;
      }
      
      // Track the usage
      if (data?.usage) {
        this.trackUsage(
          'text_generation', 
          data.usage.total_tokens || 0, 
          (data.usage.total_tokens || 0) * 0.00002 // Approximate cost calculation
        );
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with Anthropic', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // Claude-specific prompt enhancement
    const systemInstruction = context.system || "";
    
    // Claude has specific formatting for system prompts
    let enhancedPrompt = prompt;
    
    if (systemInstruction) {
      enhancedPrompt = `<system>\n${systemInstruction}\n</system>\n\n<human>\n${prompt}\n</human>\n\n<assistant>`;
    } else {
      enhancedPrompt = `<human>\n${prompt}\n</human>\n\n<assistant>`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Claude-specific RAG context preparation
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `<document id="${index+1}">\n${doc.content}\n</document>`
    );
    
    return `
<system>
You are a helpful assistant. When answering the user's question, use only the information provided in the document sections below. If the information needed is not present in the documents, respond with "I don't have enough information to answer this question."
</system>

${contextChunks.join('\n\n')}

<human>
Based on the documents provided, ${query}
</human>

<assistant>
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
