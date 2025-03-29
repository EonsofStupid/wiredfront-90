
import { 
  ChatMode, 
  ChatPosition, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode, 
  TaskType,
  UIEnforcementMode
} from '@/types/chat/enums';
import { ProviderType, VectorDbType } from '@/types/chat/communication';

/**
 * Utility class for working with enums across the application
 */
export class EnumUtils {
  /**
   * Convert a string to ChatMode enum value
   */
  static stringToChatMode(mode: string | ChatMode): ChatMode {
    // If already a ChatMode enum value, return as is
    if (typeof mode !== 'string') {
      return mode;
    }

    const normalizedMode = mode.toLowerCase().trim();
    
    switch (normalizedMode) {
      case 'chat':
        return ChatMode.Chat;
      case 'dev':
      case 'editor':
      case 'development':
        return ChatMode.Dev;
      case 'image':
        return ChatMode.Image;
      case 'training':
        return ChatMode.Training;
      case 'planning':
        return ChatMode.Planning;
      case 'code':
        return ChatMode.Code;
      case 'document':
        return ChatMode.Document;
      case 'audio':
        return ChatMode.Audio;
      default:
        return ChatMode.Chat;
    }
  }

  /**
   * Convert a string to ChatPosition enum value
   */
  static stringToChatPosition(position: string | ChatPosition): ChatPosition {
    // If already a ChatPosition enum value, return as is
    if (typeof position !== 'string') {
      return position;
    }

    const normalizedPosition = position.toLowerCase().trim();
    
    switch (normalizedPosition) {
      case 'bottom-right':
        return ChatPosition.BottomRight;
      case 'bottom-left':
        return ChatPosition.BottomLeft;
      case 'top-right':
        return ChatPosition.TopRight;
      case 'top-left':
        return ChatPosition.TopLeft;
      default:
        return ChatPosition.BottomRight;
    }
  }

  /**
   * Convert a string to TokenEnforcementMode enum value
   */
  static stringToTokenEnforcementMode(mode: string | TokenEnforcementMode): TokenEnforcementMode {
    // If already a TokenEnforcementMode enum value, return as is
    if (typeof mode !== 'string') {
      return mode;
    }

    const normalizedMode = mode.toLowerCase().trim();
    
    switch (normalizedMode) {
      case 'none':
        return TokenEnforcementMode.None;
      case 'warn':
        return TokenEnforcementMode.Warn;
      case 'soft':
        return TokenEnforcementMode.Soft;
      case 'hard':
        return TokenEnforcementMode.Hard;
      case 'always':
        return TokenEnforcementMode.Always;
      case 'never':
        return TokenEnforcementMode.Never;
      case 'role_based':
      case 'role-based':
        return TokenEnforcementMode.RoleBased;
      case 'mode_based':
      case 'mode-based':
        return TokenEnforcementMode.ModeBased;
      case 'strict':
        return TokenEnforcementMode.Strict;
      default:
        return TokenEnforcementMode.None;
    }
  }

  /**
   * Convert TokenEnforcementMode to UIEnforcementMode
   */
  static tokenToUIEnforcementMode(mode: TokenEnforcementMode): UIEnforcementMode {
    switch (mode) {
      case TokenEnforcementMode.Hard:
      case TokenEnforcementMode.Always:
      case TokenEnforcementMode.Strict:
        return UIEnforcementMode.Always;
      case TokenEnforcementMode.Soft:
      case TokenEnforcementMode.Warn:
      case TokenEnforcementMode.RoleBased:
      case TokenEnforcementMode.ModeBased:
        return UIEnforcementMode.Soft;
      case TokenEnforcementMode.None:
      case TokenEnforcementMode.Never:
        return UIEnforcementMode.Never;
      default:
        return UIEnforcementMode.Soft;
    }
  }

  /**
   * Convert UIEnforcementMode to TokenEnforcementMode
   */
  static uiToTokenEnforcementMode(mode: UIEnforcementMode): TokenEnforcementMode {
    switch (mode) {
      case UIEnforcementMode.Always:
        return TokenEnforcementMode.Hard;
      case UIEnforcementMode.Soft:
        return TokenEnforcementMode.Soft;
      case UIEnforcementMode.Never:
        return TokenEnforcementMode.None;
      default:
        return TokenEnforcementMode.Soft;
    }
  }

  /**
   * Convert a string to MessageRole enum value
   */
  static stringToMessageRole(role: string | MessageRole): MessageRole {
    if (typeof role !== 'string') {
      return role;
    }

    const normalizedRole = role.toLowerCase().trim();
    
    switch (normalizedRole) {
      case 'user':
        return MessageRole.User;
      case 'assistant':
        return MessageRole.Assistant;
      case 'system':
        return MessageRole.System;
      case 'error':
        return MessageRole.Error;
      case 'tool':
        return MessageRole.Tool;
      case 'function':
        return MessageRole.Function;
      default:
        return MessageRole.User;
    }
  }

  /**
   * Convert a string to MessageType enum value
   */
  static stringToMessageType(type: string | MessageType): MessageType {
    if (typeof type !== 'string') {
      return type;
    }

    const normalizedType = type.toLowerCase().trim();
    
    switch (normalizedType) {
      case 'text':
        return MessageType.Text;
      case 'command':
        return MessageType.Command;
      case 'system':
        return MessageType.System;
      case 'image':
        return MessageType.Image;
      case 'training':
        return MessageType.Training;
      case 'code':
        return MessageType.Code;
      case 'file':
        return MessageType.File;
      case 'audio':
        return MessageType.Audio;
      case 'link':
        return MessageType.Link;
      case 'document':
        return MessageType.Document;
      default:
        return MessageType.Text;
    }
  }

  /**
   * Convert a string to MessageStatus enum value
   */
  static stringToMessageStatus(status: string | MessageStatus): MessageStatus {
    if (typeof status !== 'string') {
      return status;
    }

    const normalizedStatus = status.toLowerCase().trim();
    
    switch (normalizedStatus) {
      case 'pending':
        return MessageStatus.Pending;
      case 'sending':
        return MessageStatus.Sending;
      case 'sent':
        return MessageStatus.Sent;
      case 'received':
        return MessageStatus.Received;
      case 'error':
        return MessageStatus.Error;
      case 'failed':
        return MessageStatus.Failed;
      case 'retrying':
        return MessageStatus.Retrying;
      case 'cached':
        return MessageStatus.Cached;
      case 'canceled':
        return MessageStatus.Canceled;
      case 'delivered':
        return MessageStatus.Delivered;
      default:
        return MessageStatus.Pending;
    }
  }

  /**
   * Convert a string to TaskType enum value
   */
  static stringToTaskType(type: string | TaskType): TaskType {
    if (typeof type !== 'string') {
      return type;
    }

    const normalizedType = type.toLowerCase().trim();
    
    switch (normalizedType) {
      case 'chat':
        return TaskType.Chat;
      case 'generation':
        return TaskType.Generation;
      case 'completion':
        return TaskType.Completion;
      case 'summarization':
        return TaskType.Summarization;
      case 'translation':
        return TaskType.Translation;
      case 'analysis':
        return TaskType.Analysis;
      case 'extraction':
        return TaskType.Extraction;
      case 'classification':
        return TaskType.Classification;
      case 'transformation':
        return TaskType.Transformation;
      case 'recommendation':
        return TaskType.Recommendation;
      case 'structured_output':
        return TaskType.StructuredOutput;
      case 'admin_query':
        return TaskType.AdminQuery;
      case 'system_diagnostic':
        return TaskType.SystemDiagnostic;
      case 'cache_query':
        return TaskType.CacheQuery;
      case 'vector_index':
        return TaskType.VectorIndex;
      case 'model_validation':
        return TaskType.ModelValidation;
      case 'question_answering':
        return TaskType.QuestionAnswering;
      case 'image_generation':
        return TaskType.ImageGeneration;
      case 'code_generation':
        return TaskType.CodeGeneration;
      case 'other':
      default:
        return TaskType.Other;
    }
  }

  /**
   * Convert a string to ProviderType enum value
   */
  static stringToProviderType(type: string | ProviderType): ProviderType {
    if (typeof type !== 'string') {
      return type;
    }

    const normalizedType = type.toLowerCase().trim();
    
    switch (normalizedType) {
      case 'openai':
        return ProviderType.OpenAI;
      case 'anthropic':
        return ProviderType.Anthropic;
      case 'gemini':
        return ProviderType.Gemini;
      case 'huggingface':
        return ProviderType.HuggingFace;
      case 'azure_openai':
        return ProviderType.AzureOpenAI;
      case 'cohere':
        return ProviderType.Cohere;
      case 'llama':
        return ProviderType.LLaMA;
      case 'ollama':
        return ProviderType.Ollama;
      case 'custom':
      default:
        return ProviderType.Custom;
    }
  }

  /**
   * Convert a string to VectorDbType enum value
   */
  static stringToVectorDbType(type: string | VectorDbType): VectorDbType {
    if (typeof type !== 'string') {
      return type;
    }

    const normalizedType = type.toLowerCase().trim();
    
    switch (normalizedType) {
      case 'pinecone':
        return VectorDbType.Pinecone;
      case 'weaviate':
        return VectorDbType.Weaviate;
      case 'qdrant':
        return VectorDbType.Qdrant;
      case 'milvus':
        return VectorDbType.Milvus;
      case 'supabase':
        return VectorDbType.Supabase;
      case 'chromadb':
        return VectorDbType.ChromaDB;
      case 'faiss':
        return VectorDbType.Faiss;
      default:
        return VectorDbType.Supabase;
    }
  }

  /**
   * Convert database-friendly string to enum value
   */
  static fromDatabaseString<T>(enumType: any, value: string, defaultValue: T): T {
    try {
      // Check if the value exists in the enum
      if (Object.values(enumType).includes(value)) {
        return value as unknown as T;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error converting database value to enum: ${error}`);
      return defaultValue;
    }
  }

  /**
   * Get a user-friendly display label for an enum value
   */
  static getDisplayLabel(enumValue: any, prefix = ''): string {
    if (enumValue === null || enumValue === undefined) {
      return '';
    }
    
    // Convert to string and handle formatting
    const valueStr = String(enumValue);
    
    // Convert snake_case to Title Case
    if (valueStr.includes('_')) {
      return valueStr
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Convert camelCase to Title Case
    return prefix + (valueStr.charAt(0).toUpperCase() + valueStr.slice(1).replace(/([A-Z])/g, ' $1'));
  }
}

// Export all enum types for convenience
export { 
  ChatMode, 
  ChatPosition, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode, 
  TaskType,
  UIEnforcementMode,
  ProviderType,
  VectorDbType
};
