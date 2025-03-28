
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { MessageEnvelope, ResponseEnvelope, TaskType } from '@/types/chat/communication';

export interface PromptLogEntry {
  traceId: string;
  sessionId: string;
  userId?: string;
  prompt: string;
  response: string;
  modelId: string;
  provider: string;
  mode: string;
  taskType: TaskType;
  tokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
  fallbacksUsed?: number;
  timestamp: string;
}

/**
 * Log a prompt and related metadata to the database
 */
export async function logPrompt(
  envelope: MessageEnvelope,
  response: ResponseEnvelope,
  success: boolean,
  error?: string
): Promise<void> {
  try {
    const logEntry: PromptLogEntry = {
      traceId: envelope.traceId,
      sessionId: envelope.sessionId,
      userId: envelope.metadata?.userId,
      prompt: envelope.input,
      response: response.output,
      modelId: response.model,
      provider: response.provider,
      mode: envelope.mode,
      taskType: envelope.taskType,
      tokensUsed: response.tokensUsed.total,
      inputTokens: response.tokensUsed.input,
      outputTokens: response.tokensUsed.output,
      latencyMs: response.processingTimeMs,
      success,
      error,
      metadata: {
        ...envelope.metadata,
        ...response.metadata
      },
      fallbacksUsed: response.fallbacksUsed,
      timestamp: new Date().toISOString()
    };

    // Log to console for debugging
    if (success) {
      logger.info('Prompt completed', {
        traceId: logEntry.traceId,
        sessionId: logEntry.sessionId,
        model: logEntry.modelId,
        provider: logEntry.provider,
        tokensUsed: logEntry.tokensUsed,
        latencyMs: logEntry.latencyMs,
        mode: logEntry.mode,
        taskType: logEntry.taskType
      });
    } else {
      logger.error('Prompt failed', {
        traceId: logEntry.traceId,
        sessionId: logEntry.sessionId,
        error: logEntry.error,
        model: logEntry.modelId,
        provider: logEntry.provider,
        mode: logEntry.mode,
        taskType: logEntry.taskType
      });
    }
    
    // Store in Supabase if available
    try {
      const { error: dbError } = await supabase
        .from('orchestrator_logs')
        .insert({
          trace_id: logEntry.traceId,
          session_id: logEntry.sessionId,
          user_id: logEntry.userId,
          prompt: logEntry.prompt,
          response: logEntry.response,
          model_id: logEntry.modelId,
          provider: logEntry.provider,
          mode: logEntry.mode,
          task_type: logEntry.taskType,
          tokens_used: logEntry.tokensUsed,
          input_tokens: logEntry.inputTokens,
          output_tokens: logEntry.outputTokens,
          latency_ms: logEntry.latencyMs,
          success: logEntry.success,
          error_message: logEntry.error || null,
          metadata: logEntry.metadata,
          fallbacks_used: logEntry.fallbacksUsed || 0,
          timestamp: logEntry.timestamp
        });
        
      if (dbError) {
        logger.error('Failed to log prompt to database', { error: dbError });
      }
    } catch (dbError) {
      logger.error('Failed to log prompt to database', { error: dbError });
    }
  } catch (error) {
    logger.error('Error in logPrompt', { error });
  }
}

/**
 * Log a simple prompt without all the envelope structure
 */
export async function logSimplePrompt(
  prompt: string, 
  response: string, 
  metadata: {
    userId?: string;
    sessionId: string;
    traceId: string;
    modelId: string;
    provider: string;
    tokensUsed?: number;
    inputTokens?: number;
    outputTokens?: number;
    latencyMs?: number;
    mode?: string;
    taskType?: TaskType;
    success: boolean;
    error?: string;
    [key: string]: any;
  }
): Promise<void> {
  // For now, just use the logger service
  if (metadata.success) {
    logger.info('Prompt completed', {
      traceId: metadata.traceId,
      sessionId: metadata.sessionId,
      model: metadata.modelId,
      tokensUsed: metadata.tokensUsed,
      latencyMs: metadata.latencyMs,
      mode: metadata.mode
    });
  } else {
    logger.error('Prompt failed', {
      traceId: metadata.traceId,
      sessionId: metadata.sessionId,
      error: metadata.error,
      model: metadata.modelId,
      mode: metadata.mode
    });
  }
}

export default {
  logPrompt,
  logSimplePrompt
};
