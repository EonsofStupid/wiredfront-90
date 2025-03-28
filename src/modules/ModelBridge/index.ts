
import { logger } from '@/services/chat/LoggingService';
import { logPrompt, logSimplePrompt } from '@/modules/PromptLogger';
import { MessageEnvelope, ResponseEnvelope, TaskType } from '@/types/chat/communication';
import { v4 as uuidv4 } from 'uuid';

export interface ModelOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  user?: string;
  traceId: string;
  sessionId: string;
  mode?: string;
  taskType?: TaskType;
  fallbackLevel?: number;
  [key: string]: any;
}

export interface ModelResponse {
  content: string;
  tokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  model: string;
  provider: string;
  fallbacksUsed?: number;
}

// Define fallback chains for different task types
const fallbackChains: Record<TaskType, string[]> = {
  [TaskType.Conversation]: ['gpt-4o-mini', 'gpt-4o', 'claude-3-opus'],
  [TaskType.CodeGeneration]: ['codellama-70b', 'gpt-4o', 'claude-3-opus'],
  [TaskType.CodeExplanation]: ['codellama-70b', 'gpt-4o-mini', 'gpt-4o'],
  [TaskType.BugFix]: ['codellama-70b', 'gpt-4o', 'claude-3-opus'],
  [TaskType.CodeReview]: ['gpt-4o', 'claude-3-opus'],
  [TaskType.Refactoring]: ['gpt-4o', 'claude-3-opus'],
  [TaskType.Tutoring]: ['gpt-4o', 'claude-3-sonnet'],
  [TaskType.ProblemSolving]: ['gpt-4o-mini', 'gpt-4o'],
  [TaskType.Explanation]: ['gpt-4o-mini', 'gpt-4o'],
  [TaskType.ImageGeneration]: ['dall-e-3'],
  [TaskType.ImageEditing]: ['dall-e-3'],
  [TaskType.DocumentSearch]: ['gpt-4o-mini', 'gpt-4o'],
  [TaskType.ProjectContext]: ['gpt-4o-mini', 'gpt-4o'],
};

// Map models to their providers
const modelToProvider: Record<string, string> = {
  'gpt-4o-mini': 'openai',
  'gpt-4o': 'openai',
  'dall-e-3': 'openai',
  'claude-3-opus': 'anthropic',
  'claude-3-sonnet': 'anthropic',
  'claude-3-haiku': 'anthropic',
  'codellama-70b': 'local',
  'llama-3-70b': 'local',
};

/**
 * Generate a completion from a model
 */
export async function generateCompletion(
  prompt: string,
  options: ModelOptions
): Promise<ModelResponse> {
  const startTime = Date.now();
  const taskType = options.taskType || TaskType.Conversation;
  const fallbackLevel = options.fallbackLevel || 0;
  
  try {
    // Determine which model to use based on task type and fallback level
    const fallbackChain = fallbackChains[taskType] || fallbackChains[TaskType.Conversation];
    const model = options.model || fallbackChain[fallbackLevel] || 'gpt-4o-mini';
    const provider = modelToProvider[model] || 'openai';
    
    logger.info('Model completion requested', { 
      model, 
      provider,
      promptLength: prompt.length,
      traceId: options.traceId,
      sessionId: options.sessionId,
      mode: options.mode,
      taskType,
      fallbackLevel
    });
    
    // This is a placeholder - would connect to OpenAI, Anthropic, etc.
    const response = {
      content: "This is a placeholder response. The actual implementation would call the appropriate model API.",
      tokensUsed: 10,
      inputTokens: 5,
      outputTokens: 5,
      latencyMs: Date.now() - startTime,
      model,
      provider,
      fallbacksUsed: fallbackLevel
    };
    
    // Log the successful completion
    await logSimplePrompt(prompt, response.content, {
      userId: options.user,
      sessionId: options.sessionId,
      traceId: options.traceId,
      modelId: model,
      provider,
      tokensUsed: response.tokensUsed,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      latencyMs: response.latencyMs,
      mode: options.mode,
      taskType,
      success: true,
      fallbackLevel
    });
    
    return response;
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Try fallback if available
    if (fallbackLevel < (fallbackChains[taskType]?.length || 0) - 1) {
      logger.warn('Model completion failed, trying fallback', {
        error: errorMessage,
        traceId: options.traceId,
        fallbackLevel,
        nextFallback: fallbackLevel + 1
      });
      
      // Attempt with next fallback
      return generateCompletion(prompt, {
        ...options,
        fallbackLevel: fallbackLevel + 1
      });
    }
    
    // Log the failed completion if no more fallbacks
    await logSimplePrompt(prompt, "", {
      userId: options.user,
      sessionId: options.sessionId,
      traceId: options.traceId,
      modelId: options.model || 'unknown',
      provider: 'unknown',
      latencyMs,
      mode: options.mode,
      taskType,
      success: false,
      error: errorMessage,
      fallbackLevel
    });
    
    logger.error('Model completion failed (all fallbacks exhausted)', { 
      error, 
      model: options.model,
      traceId: options.traceId 
    });
    
    throw error;
  }
}

/**
 * Process a message envelope and return a response
 */
export async function processMessage(
  envelope: MessageEnvelope
): Promise<ResponseEnvelope> {
  const startTime = Date.now();
  
  try {
    // Get the appropriate model for this task type
    const fallbackChain = fallbackChains[envelope.taskType] || fallbackChains[TaskType.Conversation];
    const model = fallbackChain[envelope.fallbackLevel || 0] || 'gpt-4o-mini';
    const provider = modelToProvider[model] || 'openai';
    
    // Generate completion
    const response = await generateCompletion(envelope.input, {
      model,
      temperature: envelope.temperature || 0.7,
      maxTokens: envelope.maxTokens || 1000,
      traceId: envelope.traceId,
      sessionId: envelope.sessionId,
      mode: envelope.mode,
      taskType: envelope.taskType,
      fallbackLevel: envelope.fallbackLevel || 0,
      user: envelope.metadata?.userId
    });
    
    // Create response envelope
    const responseEnvelope: ResponseEnvelope = {
      traceId: envelope.traceId,
      sessionId: envelope.sessionId,
      taskType: envelope.taskType,
      output: response.content,
      model: response.model,
      provider: response.provider,
      tokensUsed: {
        input: response.inputTokens,
        output: response.outputTokens,
        total: response.tokensUsed
      },
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      fallbacksUsed: response.fallbacksUsed || 0,
      metadata: envelope.metadata
    };
    
    // Log the completed message processing
    await logPrompt(envelope, responseEnvelope, true);
    
    return responseEnvelope;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Create error response envelope
    const errorResponseEnvelope: ResponseEnvelope = {
      traceId: envelope.traceId,
      sessionId: envelope.sessionId,
      taskType: envelope.taskType,
      output: `Error: ${errorMessage}`,
      model: 'error',
      provider: 'error',
      tokensUsed: {
        input: 0,
        output: 0,
        total: 0
      },
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      error: errorMessage,
      metadata: envelope.metadata
    };
    
    // Log the error
    await logPrompt(envelope, errorResponseEnvelope, false, errorMessage);
    
    return errorResponseEnvelope;
  }
}

export default {
  generateCompletion,
  processMessage
};
