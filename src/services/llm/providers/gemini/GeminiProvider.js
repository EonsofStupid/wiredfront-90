import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { BaseProvider } from '../base/BaseProvider';
export class GeminiProvider extends BaseProvider {
    constructor() {
        super('gemini-default', 'Google Gemini', 'gemini', 'chat');
        // Set Gemini specific capabilities
        this.capabilities = {
            chat: true,
            image: false, // No native image generation yet
            dev: true, // Good for code tasks
            voice: false, // No native voice support
            streaming: true,
            rag: true
        };
        // Set default model and configuration
        this.config = {
            apiKey: null,
            modelName: 'gemini-1.5-flash',
            options: {
                temperature: 0.7,
                maxTokens: 1000
            }
        };
    }
    async generateText(prompt, options = {}) {
        try {
            if (!this.config.apiKey) {
                await this.initialize();
                if (!this.config.apiKey) {
                    return "Error: Gemini API key not configured. Please set GEMINI_CHAT_APIKEY.";
                }
            }
            // Use the edge function to proxy the request to Gemini
            const { data, error } = await supabase.functions.invoke('llm-generate-text', {
                body: {
                    provider: 'gemini',
                    prompt,
                    options: {
                        model: options.modelName || this.config.modelName,
                        temperature: options.temperature || this.config.options.temperature,
                        maxOutputTokens: options.maxTokens || this.config.options.maxTokens,
                        systemPrompt: options.systemPrompt || '',
                        ...options
                    }
                }
            });
            if (error) {
                logger.error('Error generating text with Gemini', error);
                return `Error generating text: ${error.message}`;
            }
            // Track the usage (Gemini doesn't provide detailed token info yet)
            this.trackUsage('text_generation', 1000, 0.0001); // Approximate usage tracking
            return data?.text || 'No response generated';
        }
        catch (error) {
            logger.error('Failed to generate text with Gemini', error);
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    async enhancePrompt(prompt, context = {}) {
        // Gemini-specific prompt enhancement
        const systemInstruction = context.system || "";
        // Gemini works better with this format
        if (systemInstruction) {
            return `${systemInstruction}\n\nUser request: ${prompt}`;
        }
        return prompt;
    }
    async prepareRAGContext(documents, query) {
        // Gemini-specific RAG context preparation
        if (!documents || documents.length === 0) {
            return query;
        }
        const contextChunks = documents.map((doc, index) => `Context ${index + 1}:\n${doc.content}\n`);
        return `
Here are some relevant documents:

${contextChunks.join('\n')}

Based on the above information, please answer this question: ${query}
`;
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
            systemPrompt: "You are an expert programmer. Focus on writing clean, efficient, and well-documented code that solves the user's problem.",
            temperature: 0.2, // Lower temperature for more deterministic code generation
            ...options
        });
    }
}
