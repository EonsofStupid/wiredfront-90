
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
  vectorSearchPerformed?: boolean;
  vectorChunksRetrieved?: number;
  vectorDbUsed?: string;
  cacheHit?: boolean;
  cacheTier?: string;
  fineTuneCandidate?: boolean;
  responseQuality?: string;
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
        ...response.metadata,
        adminFlags: envelope.adminFlags
      },
      fallbacksUsed: response.fallbacksUsed,
      timestamp: new Date().toISOString(),
      vectorSearchPerformed: response.vectorInfo?.searchPerformed,
      vectorChunksRetrieved: response.vectorInfo?.chunksRetrieved,
      vectorDbUsed: response.vectorInfo?.vectorDb,
      cacheHit: response.cacheInfo?.cacheHit,
      cacheTier: response.cacheInfo?.cacheTier || undefined,
      fineTuneCandidate: response.fineTuneMetadata?.markedForFineTune,
      responseQuality: response.fineTuneMetadata?.quality
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
        taskType: logEntry.taskType,
        cacheHit: logEntry.cacheHit
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
          metadata: {
            ...logEntry.metadata,
            vectorInfo: {
              searchPerformed: logEntry.vectorSearchPerformed,
              chunksRetrieved: logEntry.vectorChunksRetrieved,
              vectorDb: logEntry.vectorDbUsed
            },
            cacheInfo: {
              cacheHit: logEntry.cacheHit,
              cacheTier: logEntry.cacheTier
            },
            fineTuneInfo: {
              isCandidate: logEntry.fineTuneCandidate,
              quality: logEntry.responseQuality
            }
          },
          fallbacks_used: logEntry.fallbacksUsed || 0,
          timestamp: logEntry.timestamp
        });
        
      if (dbError) {
        logger.error('Failed to log prompt to database', { error: dbError });
      }
      
      // Also log to model_usage table for billing and quota tracking
      if (success && logEntry.userId) {
        await supabase
          .from('model_usage')
          .insert({
            user_id: logEntry.userId,
            model_id: logEntry.modelId,
            tokens_used: logEntry.tokensUsed,
            // Rough cost estimate based on model (this would be more precise in production)
            cost_usd: calculateCost(logEntry.modelId, logEntry.tokensUsed)
          });
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
  
  // Log to database as well
  try {
    if (metadata.userId) {
      await supabase
        .from('orchestrator_logs')
        .insert({
          trace_id: metadata.traceId,
          session_id: metadata.sessionId,
          user_id: metadata.userId,
          prompt: prompt,
          response: response,
          model_id: metadata.modelId,
          provider: metadata.provider,
          mode: metadata.mode || 'unknown',
          task_type: metadata.taskType || TaskType.Conversation,
          tokens_used: metadata.tokensUsed || 0,
          input_tokens: metadata.inputTokens || 0,
          output_tokens: metadata.outputTokens || 0,
          latency_ms: metadata.latencyMs || 0,
          success: metadata.success,
          error_message: metadata.error || null,
          metadata: metadata,
          timestamp: new Date().toISOString()
        });
        
      // Also log to model_usage for billing
      if (metadata.success) {
        await supabase
          .from('model_usage')
          .insert({
            user_id: metadata.userId,
            model_id: metadata.modelId,
            tokens_used: metadata.tokensUsed || 0,
            cost_usd: calculateCost(metadata.modelId, metadata.tokensUsed || 0)
          });
      }
    }
  } catch (error) {
    logger.error('Failed to log simple prompt to database', { error });
  }
}

/**
 * Calculate approximate cost based on model and tokens
 */
function calculateCost(modelId: string, tokensUsed: number): number {
  // These are very rough estimates - would be more precise in production
  const costPerThousandTokens: Record<string, number> = {
    'gpt-4o': 0.005,
    'gpt-4o-mini': 0.00015,
    'gpt-4': 0.03,
    'claude-3-opus': 0.015,
    'claude-3-sonnet': 0.003,
    'claude-3-haiku': 0.00025,
    'codellama-70b': 0.0001, // Local models have minimal costs
    'gemini-pro': 0.0001
  };
  
  const rate = costPerThousandTokens[modelId] || 0.001; // Default if unknown
  return (tokensUsed / 1000) * rate;
}

export default {
  logPrompt,
  logSimplePrompt
};
