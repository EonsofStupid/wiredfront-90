import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
export class ReplicateProvider {
    constructor() {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'replicate-default'
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Replicate'
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'replicate'
        });
        Object.defineProperty(this, "category", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'chat'
        });
        Object.defineProperty(this, "capabilities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                chat: true,
                image: true,
                dev: false,
                voice: false,
                streaming: false,
                rag: false
            }
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                apiKey: null,
                modelName: 'meta/llama-3-70b-instruct:bbca6163e425c027989097967d5e491dd7eb46fddc0c2ab20bbb7c8873f62ea3',
                options: {
                    temperature: 0.7,
                    maxTokens: 1000
                }
            }
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                isConnected: false,
                lastConnected: null,
                error: null,
                isRateLimited: false,
                rateLimitResetTime: null
            }
        });
        Object.defineProperty(this, "metrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                tokensUsed: 0,
                cost: 0,
                requests: 0,
                lastRequest: null
            }
        });
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.initializeApiKey();
    }
    async initializeApiKey() {
        try {
            const { data, error } = await supabase.functions.invoke('get-provider-key', {
                body: { provider: 'replicate', keyType: 'chat' }
            });
            if (error) {
                this.status.error = error.message;
                logger.error('Error getting Replicate API key', { error });
                return;
            }
            if (data?.apiKey) {
                this.apiKey = data.apiKey;
                this.config.apiKey = data.apiKey;
                this.status.isConnected = true;
                this.status.lastConnected = new Date().toISOString();
                logger.info('Replicate API key initialized');
            }
            else {
                this.status.error = 'No API key found';
                logger.warn('No Replicate API key found');
            }
        }
        catch (error) {
            this.status.error = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Failed to initialize Replicate API key', { error });
        }
    }
    async initialize() {
        await this.initializeApiKey();
        return this.status.isConnected;
    }
    async testConnection() {
        return this.status.isConnected;
    }
    async generateText(prompt, options) {
        try {
            if (!this.apiKey) {
                await this.initializeApiKey();
                if (!this.apiKey) {
                    return "Error: Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.";
                }
            }
            const { data, error } = await supabase.functions.invoke('llm-generate-text', {
                body: {
                    provider: 'replicate',
                    prompt,
                    options: {
                        model: options?.modelName || this.config.modelName,
                        temperature: options?.temperature || this.config.options.temperature,
                        max_tokens: options?.maxTokens || this.config.options.maxTokens,
                        ...options
                    }
                }
            });
            if (error) {
                this.metrics.requests++;
                this.status.error = error.message;
                logger.error('Error generating text with Replicate', { error });
                return `Error generating text: ${error.message}`;
            }
            this.metrics.requests++;
            this.metrics.tokensUsed += (data?.tokens || 0);
            this.metrics.lastRequest = new Date().toISOString();
            return data?.text || 'No response generated';
        }
        catch (error) {
            this.metrics.requests++;
            this.status.error = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Failed to generate text with Replicate', { error });
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    async generateImage(prompt, options) {
        try {
            if (!this.apiKey) {
                await this.initializeApiKey();
                if (!this.apiKey) {
                    return "Error: Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.";
                }
            }
            const { data, error } = await supabase.functions.invoke('llm-generate-image', {
                body: {
                    provider: 'replicate',
                    prompt,
                    options: {
                        model: options?.modelName || 'stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
                        width: options?.width || 1024,
                        height: options?.height || 1024,
                        num_outputs: options?.numImages || 1,
                        ...options
                    }
                }
            });
            if (error) {
                this.metrics.requests++;
                this.status.error = error.message;
                logger.error('Error generating image with Replicate', { error });
                return `Error generating image: ${error.message}`;
            }
            this.metrics.requests++;
            this.metrics.lastRequest = new Date().toISOString();
            return data?.imageUrl || 'No image generated';
        }
        catch (error) {
            this.metrics.requests++;
            this.status.error = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Failed to generate image with Replicate', { error });
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    async enhancePrompt(prompt, context) {
        const systemInstruction = context?.system || "";
        return systemInstruction ? `${systemInstruction}\n\nUser: ${prompt}\nAssistant:` : `User: ${prompt}\nAssistant:`;
    }
    async prepareRAGContext(documents, query) {
        if (!documents || documents.length === 0) {
            return query;
        }
        const contextChunks = documents.map((doc, index) => `Document ${index + 1}:\n${doc.content}`);
        return `
I need to answer the following question using only the information in these documents:

${contextChunks.join('\n\n')}

Question: ${query}

Answer (using only information from the documents):
`;
    }
    trackUsage(operation, tokens, cost) {
        this.metrics.tokensUsed += tokens;
        this.metrics.cost += cost;
        this.metrics.requests++;
        this.metrics.lastRequest = new Date().toISOString();
    }
    // Optional methods
    async generateCode(prompt, options) {
        throw new Error('Code generation not supported by Replicate provider');
    }
    async generateVoice(text, options) {
        throw new Error('Voice generation not supported by Replicate provider');
    }
}
