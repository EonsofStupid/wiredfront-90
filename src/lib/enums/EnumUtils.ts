
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode,
  TaskType,
  UIEnforcementMode
} from '@/types/chat/enums';
import { ProviderType, VectorDbType } from '@/types/chat/communication';

/**
 * Utility class for handling enum conversions and validations
 * This class serves as the central point for all enum-related operations
 */
export class EnumUtils {
  /**
   * Convert string to ChatMode enum with fallback
   */
  static stringToChatMode(mode: string): ChatMode {
    const normalizedMode = mode?.toLowerCase().trim() || '';
    
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
        return ChatMode.Chat; // Default fallback
    }
  }

  /**
   * Convert ChatMode enum to database string representation
   */
  static chatModeToString(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat:
        return 'chat';
      case ChatMode.Dev:
      case ChatMode.Editor:
        return 'dev';
      case ChatMode.Image:
        return 'image';
      case ChatMode.Training:
        return 'training';
      case ChatMode.Planning:
        return 'planning';
      case ChatMode.Code:
        return 'code';
      case ChatMode.Document:
        return 'document';
      case ChatMode.Audio:
        return 'audio';
      default:
        return 'chat';
    }
  }

  /**
   * Alias for chatModeToString - for consistency with other methods
   */
  static chatModeForDatabase(mode: ChatMode): string {
    return this.chatModeToString(mode);
  }

  /**
   * Convert database string to ChatMode enum
   */
  static databaseStringToChatMode(mode: string): ChatMode {
    return this.stringToChatMode(mode);
  }

  /**
   * Convert string to TokenEnforcementMode enum with fallback
   */
  static stringToTokenEnforcementMode(mode: string | TokenEnforcementMode): TokenEnforcementMode {
    // If already an enum, return it
    if (Object.values(TokenEnforcementMode).includes(mode as TokenEnforcementMode)) {
      return mode as TokenEnforcementMode;
    }

    const normalizedMode = typeof mode === 'string' ? mode.toLowerCase().trim() : '';
    
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
      case 'rolebased':
        return TokenEnforcementMode.RoleBased;
      case 'mode_based':
      case 'mode-based':
      case 'modebased':
        return TokenEnforcementMode.ModeBased;
      case 'strict':
        return TokenEnforcementMode.Strict;
      default:
        return TokenEnforcementMode.None; // Default fallback
    }
  }

  /**
   * Convert TokenEnforcementMode enum to UI-friendly mode
   */
  static tokenEnforcementModeToUIMode(mode: TokenEnforcementMode): UIEnforcementMode {
    switch (mode) {
      case TokenEnforcementMode.None:
      case TokenEnforcementMode.Never:
        return UIEnforcementMode.Never;
      case TokenEnforcementMode.Warn:
      case TokenEnforcementMode.Soft:
      case TokenEnforcementMode.RoleBased:
      case TokenEnforcementMode.ModeBased:
        return UIEnforcementMode.Soft;
      case TokenEnforcementMode.Hard:
      case TokenEnforcementMode.Always:
      case TokenEnforcementMode.Strict:
        return UIEnforcementMode.Always;
      default:
        return UIEnforcementMode.Never;
    }
  }

  /**
   * Convert UI enforcement mode to token enforcement mode
   */
  static uiModeToTokenEnforcementMode(mode: UIEnforcementMode): TokenEnforcementMode {
    switch (mode) {
      case UIEnforcementMode.Never:
        return TokenEnforcementMode.Never;
      case UIEnforcementMode.Soft:
        return TokenEnforcementMode.Soft;
      case UIEnforcementMode.Always:
        return TokenEnforcementMode.Hard;
      default:
        return TokenEnforcementMode.Never;
    }
  }

  /**
   * Convert MessageType enum to string representation for database
   */
  static messageTypeToString(type: MessageType): string {
    return type.toString();
  }

  /**
   * Convert string to MessageType with fallback
   */
  static stringToMessageType(type: string): MessageType {
    const normalizedType = type?.toLowerCase().trim() || '';
    
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
        return MessageType.Text; // Default fallback
    }
  }
  
  /**
   * Convert string to MessageRole with fallback
   */
  static stringToMessageRole(role: string): MessageRole {
    const normalizedRole = role?.toLowerCase().trim() || '';
    
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
        return MessageRole.User; // Default fallback
    }
  }
  
  /**
   * Convert MessageRole to string representation for database
   */
  static messageRoleToString(role: MessageRole): string {
    return role.toString();
  }
  
  /**
   * Get human-readable label for a MessageRole
   */
  static getMessageRoleLabel(role: MessageRole): string {
    switch (role) {
      case MessageRole.User:
        return 'User';
      case MessageRole.Assistant:
        return 'Assistant';
      case MessageRole.System:
        return 'System';
      case MessageRole.Error:
        return 'Error';
      case MessageRole.Tool:
        return 'Tool';
      case MessageRole.Function:
        return 'Function';
      default:
        return 'Unknown';
    }
  }

  /**
   * Convert string to TaskType enum with fallback
   */
  static stringToTaskType(type: string): TaskType {
    const normalizedType = type?.toLowerCase().trim() || '';
    
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
      case 'conversation':
        return TaskType.Chat; // Alias for backward compatibility
      default:
        return TaskType.Other; // Default fallback
    }
  }

  /**
   * Convert string to ProviderType enum with fallback
   */
  static stringToProviderType(provider: string): ProviderType {
    const normalizedProvider = provider?.toLowerCase().trim() || '';
    
    switch (normalizedProvider) {
      case 'openai':
        return ProviderType.OpenAI;
      case 'anthropic':
        return ProviderType.Anthropic;
      case 'gemini':
        return ProviderType.Gemini;
      case 'huggingface':
        return ProviderType.HuggingFace;
      case 'azure_openai':
      case 'azure-openai':
        return ProviderType.AzureOpenAI;
      case 'cohere':
        return ProviderType.Cohere;
      case 'llama':
        return ProviderType.LLaMA;
      case 'ollama':
        return ProviderType.Ollama;
      default:
        return ProviderType.Custom; // Default fallback
    }
  }

  /**
   * Convert string to VectorDbType enum with fallback
   */
  static stringToVectorDbType(db: string): VectorDbType {
    const normalizedDb = db?.toLowerCase().trim() || '';
    
    switch (normalizedDb) {
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
        return VectorDbType.Supabase; // Default fallback
    }
  }

  /**
   * Get human-readable label for a ChatMode
   */
  static getChatModeLabel(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat:
        return 'Chat';
      case ChatMode.Dev:
      case ChatMode.Editor:
        return 'Developer';
      case ChatMode.Image:
        return 'Image';
      case ChatMode.Training:
        return 'Training';
      case ChatMode.Planning:
        return 'Planning';
      case ChatMode.Code:
        return 'Code';
      case ChatMode.Document:
        return 'Document';
      case ChatMode.Audio:
        return 'Audio';
      default:
        return 'Chat';
    }
  }

  /**
   * Convert UI chat mode to database mode
   */
  static uiModeToChatMode(uiMode: string): ChatMode {
    return this.stringToChatMode(uiMode);
  }

  /**
   * Convert database chat mode to UI mode
   */
  static chatModeToUiMode(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat:
        return 'standard';
      case ChatMode.Dev:
      case ChatMode.Editor:
        return 'editor';
      case ChatMode.Image:
        return 'image';
      case ChatMode.Training:
        return 'training';
      case ChatMode.Planning:
        return 'planning';
      case ChatMode.Code:
        return 'code';
      case ChatMode.Document:
        return 'document';
      case ChatMode.Audio:
        return 'audio';
      default:
        return 'standard';
    }
  }

  /**
   * Get icon name for a ChatMode
   */
  static getChatModeIcon(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat:
        return 'message-circle';
      case ChatMode.Dev:
      case ChatMode.Editor:
        return 'code';
      case ChatMode.Image:
        return 'image';
      case ChatMode.Training:
        return 'graduation-cap';
      case ChatMode.Planning:
        return 'clipboard-list';
      case ChatMode.Code:
        return 'terminal';
      case ChatMode.Document:
        return 'file-text';
      case ChatMode.Audio:
        return 'headphones';
      default:
        return 'message-circle';
    }
  }
  
  /**
   * Convert string to MessageStatus with fallback
   */
  static stringToMessageStatus(status: string): MessageStatus {
    const normalizedStatus = status?.toLowerCase().trim() || '';
    
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
        return MessageStatus.Pending; // Default fallback
    }
  }
  
  /**
   * Convert MessageStatus to string representation for database
   */
  static messageStatusToString(status: MessageStatus): string {
    return status.toString();
  }
  
  /**
   * Safely parse a string to any enum type with fallback
   */
  static safeParse(enumName: string, value: string, fallback: string = ''): any {
    try {
      if (enumName === 'TokenEnforcementMode') {
        return this.stringToTokenEnforcementMode(value);
      } else if (enumName === 'ChatMode') {
        return this.stringToChatMode(value);
      } else if (enumName === 'TaskType') {
        return this.stringToTaskType(value);
      } else if (enumName === 'MessageType') {
        return this.stringToMessageType(value);
      } else if (enumName === 'MessageRole') {
        return this.stringToMessageRole(value);
      } else if (enumName === 'MessageStatus') {
        return this.stringToMessageStatus(value);
      }
      return value;
    } catch (error) {
      return fallback || value;
    }
  }
}
