
import { logger } from '@/services/chat/LoggingService';

/**
 * Log a prompt and related metadata
 */
export async function logPrompt(
  prompt: string, 
  response: string, 
  metadata: {
    userId?: string;
    sessionId: string;
    traceId: string;
    modelId: string;
    tokensUsed?: number;
    inputTokens?: number;
    outputTokens?: number;
    latencyMs?: number;
    mode?: string;
    success: boolean;
    error?: string;
    [key: string]: any;
  }
) {
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
  
  // In a more complete implementation, we would store this in Supabase
  // This is a placeholder for future implementation
  /* 
  try {
    const { error } = await supabase
      .from('orchestrator_logs')
      .insert({
        trace_id: metadata.traceId,
        session_id: metadata.sessionId,
        user_id: metadata.userId,
        prompt: prompt,
        response: response,
        model_id: metadata.modelId,
        tokens_used: metadata.tokensUsed || 0,
        input_tokens: metadata.inputTokens || 0,
        output_tokens: metadata.outputTokens || 0,
        latency_ms: metadata.latencyMs || 0,
        mode: metadata.mode,
        success: metadata.success,
        error_message: metadata.error || null,
        metadata: metadata
      });
      
    if (error) {
      logger.error('Failed to log prompt to database', { error });
    }
  } catch (error) {
    logger.error('Failed to log prompt to database', { error });
  }
  */
}

export default {
  logPrompt
};
