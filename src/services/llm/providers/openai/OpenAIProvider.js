import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { BaseProvider } from '../base/BaseProvider';
export class OpenAIProvider extends BaseProvider {
    constructor() {
        super('openai-default', 'OpenAI', 'openai', 'chat');
        // Set OpenAI specific capabilities
        this.capabilities = {
            chat: true,
            image: true, // DALL-E support
            dev: true, // Code completion support
            voice: false, // No native voice support
            streaming: true,
            rag: true
        };
        // Set default model and configuration
        this.config = {
            apiKey: null,
            modelName: 'gpt-4o',
            baseUrl: 'https://api.openai.com/v1',
            options: {
                temperature: 0.7,
                maxTokens: 1000,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0
            }
        };
    }
    async generateText(prompt, options = {}) {
        try {
            if (!this.config.apiKey) {
                await this.initialize();
                if (!this.config.apiKey) {
                    return "Error: OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.";
                }
            }
            // Use the edge function to proxy the request to OpenAI
            const { data, error } = await supabase.functions.invoke('llm-generate-text', {
                body: {
                    provider: 'openai',
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
                logger.error('Error generating text with OpenAI', error);
                return `Error generating text: ${error.message}`;
            }
            // Track the usage
            if (data?.usage) {
                this.trackUsage('text_generation', data.usage.total_tokens || 0, (data.usage.total_tokens || 0) * 0.00001 // Approximate cost calculation
                );
            }
            return data?.text || 'No response generated';
        }
        catch (error) {
            logger.error('Failed to generate text with OpenAI', error);
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    async enhancePrompt(prompt, context = {}) {
        // OpenAI-specific prompt enhancement
        const system = context.system || "You are a helpful assistant.";
        const enhancedPrompt = `${system}\n\n${prompt}`;
        return enhancedPrompt;
    }
    async prepareRAGContext(documents, query) {
        // OpenAI-specific RAG context preparation
        if (!documents || documents.length === 0) {
            return query;
        }
        const contextChunks = documents.map((doc, index) => `[Document ${index + 1}]: ${doc.content}`);
        return `
I need information to answer the following query: "${query}"

Here is the relevant context information:
${contextChunks.join('\n\n')}

Based on the above context, please help with the query.
`;
    }
    async generateImage(prompt, options = {}) {
        try {
            if (!this.config.apiKey) {
                await this.initialize();
                if (!this.config.apiKey) {
                    return "Error: OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.";
                }
            }
            // Use the edge function to proxy the request to OpenAI's DALL-E
            const { data, error } = await supabase.functions.invoke('llm-generate-image', {
                body: {
                    provider: 'openai',
                    prompt,
                    options: {
                        model: 'dall-e-3',
                        size: `${options.width || 1024}x${options.height || 1024}`,
                        quality: options.style || 'standard',
                        n: options.numImages || 1,
                        ...options
                    }
                }
            });
            if (error) {
                logger.error('Error generating image with OpenAI', error);
                return `Error generating image: ${error.message}`;
            }
            // Track image generation usage (approximate cost)
            this.trackUsage('image_generation', 0, 0.04); // ~$0.04 per DALL-E 3 image
            return data?.imageUrl || 'No image generated';
        }
        catch (error) {
            logger.error('Failed to generate image with OpenAI', error);
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    async generateCode(prompt, options = {}) {
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
