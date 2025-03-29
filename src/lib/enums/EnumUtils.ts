
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TaskType,
  TokenEnforcementMode,
  UIEnforcementMode
} from '@/components/chat/types/chat/enums';

/**
 * UI mode representation (used in UI components)
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * Utility class for enum operations
 */
export class EnumUtils {
  /**
   * Convert string to ChatMode enum with fallback
   * @param mode String representation of mode
   * @returns ChatMode enum value
   */
  static stringToChatMode(mode: string): ChatMode {
    switch (mode.toLowerCase()) {
      case 'chat': return ChatMode.Chat;
      case 'dev': 
      case 'editor': return ChatMode.Dev;
      case 'image': return ChatMode.Image;
      case 'training': return ChatMode.Training;
      case 'planning': return ChatMode.Planning;
      case 'code': return ChatMode.Code;
      case 'document': return ChatMode.Document;
      case 'audio': return ChatMode.Audio;
      default: return ChatMode.Chat;
    }
  }

  /**
   * Convert ChatMode to string representation
   * @param mode ChatMode enum
   * @returns String representation
   */
  static chatModeToString(mode: ChatMode): string {
    return mode.toString();
  }

  /**
   * Convert ChatMode to UI mode
   * @param mode ChatMode enum
   * @returns UiChatMode string
   */
  static chatModeToUiMode(mode: ChatMode): UiChatMode {
    switch (mode) {
      case ChatMode.Chat: return 'standard';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'editor';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Planning: return 'planning';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      case ChatMode.Audio: return 'audio';
      default: return 'standard';
    }
  }

  /**
   * Convert UiChatMode to ChatMode enum
   * @param mode UiChatMode string
   * @returns ChatMode enum
   */
  static uiModeToChatMode(mode: UiChatMode): ChatMode {
    switch (mode) {
      case 'standard': return ChatMode.Chat;
      case 'editor': return ChatMode.Dev;
      case 'image': return ChatMode.Image;
      case 'training': return ChatMode.Training;
      case 'planning': return ChatMode.Planning;
      case 'code': return ChatMode.Code;
      case 'document': return ChatMode.Document;
      case 'audio': return ChatMode.Audio;
      default: return ChatMode.Chat;
    }
  }

  /**
   * Get a human-readable label for a chat mode
   * @param mode ChatMode enum
   * @returns User-friendly label
   */
  static getChatModeLabel(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat: return 'Chat';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'Editor';
      case ChatMode.Image: return 'Image Generation';
      case ChatMode.Training: return 'Training';
      case ChatMode.Planning: return 'Planning';
      case ChatMode.Code: return 'Code Assistant';
      case ChatMode.Document: return 'Document';
      case ChatMode.Audio: return 'Audio';
      default: return 'Chat';
    }
  }

  /**
   * Get an icon name for a chat mode
   * @param mode ChatMode enum
   * @returns Icon name
   */
  static getChatModeIcon(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat: return 'message-square';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'code';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'book-open';
      case ChatMode.Planning: return 'clipboard-list';
      case ChatMode.Code: return 'terminal';
      case ChatMode.Document: return 'file-text';
      case ChatMode.Audio: return 'mic';
      default: return 'message-square';
    }
  }

  /**
   * Convert string to MessageRole enum
   * @param role String representation of role
   * @returns MessageRole enum
   */
  static stringToMessageRole(role: string): MessageRole {
    switch (role.toLowerCase()) {
      case 'user': return MessageRole.User;
      case 'assistant': return MessageRole.Assistant;
      case 'system': return MessageRole.System;
      case 'error': return MessageRole.Error;
      case 'tool': return MessageRole.Tool;
      case 'function': return MessageRole.Function;
      default: return MessageRole.User;
    }
  }

  /**
   * Convert string to MessageType enum
   * @param type String representation of message type
   * @returns MessageType enum
   */
  static stringToMessageType(type: string): MessageType {
    switch (type.toLowerCase()) {
      case 'text': return MessageType.Text;
      case 'command': return MessageType.Command;
      case 'system': return MessageType.System;
      case 'image': return MessageType.Image;
      case 'training': return MessageType.Training;
      case 'code': return MessageType.Code;
      case 'file': return MessageType.File;
      case 'audio': return MessageType.Audio;
      case 'link': return MessageType.Link;
      case 'document': return MessageType.Document;
      default: return MessageType.Text;
    }
  }

  /**
   * Convert message type to string for database storage
   * @param type MessageType enum
   * @returns String representation
   */
  static messageTypeToString(type: MessageType): string {
    return type.toString();
  }

  /**
   * Convert string to TaskType enum
   * @param type String representation of task type
   * @returns TaskType enum
   */
  static stringToTaskType(type: string): TaskType {
    switch (type.toLowerCase()) {
      case 'chat': return TaskType.Chat;
      case 'generation': return TaskType.Generation;
      case 'completion': return TaskType.Completion;
      case 'summarization': return TaskType.Summarization;
      case 'translation': return TaskType.Translation;
      case 'analysis': return TaskType.Analysis;
      case 'extraction': return TaskType.Extraction;
      case 'classification': return TaskType.Classification;
      case 'transformation': return TaskType.Transformation;
      case 'recommendation': return TaskType.Recommendation;
      case 'structured_output': return TaskType.StructuredOutput;
      case 'admin_query': return TaskType.AdminQuery;
      case 'system_diagnostic': return TaskType.SystemDiagnostic;
      case 'cache_query': return TaskType.CacheQuery;
      case 'vector_index': return TaskType.VectorIndex;
      case 'model_validation': return TaskType.ModelValidation;
      case 'question_answering': return TaskType.QuestionAnswering;
      case 'image_generation': return TaskType.ImageGeneration;
      case 'code_generation': return TaskType.CodeGeneration;
      case 'tutoring': return TaskType.Tutoring;
      case 'problem_solving': return TaskType.ProblemSolving;
      case 'explanation': return TaskType.Explanation;
      case 'code_explanation': return TaskType.CodeExplanation;
      case 'bug_fix': return TaskType.BugFix;
      case 'code_review': return TaskType.CodeReview;
      case 'refactoring': return TaskType.Refactoring;
      case 'project_context': return TaskType.ProjectContext;
      case 'image_editing': return TaskType.ImageEditing;
      case 'document_search': return TaskType.DocumentSearch;
      case 'conversation': return TaskType.Conversation;
      default: return TaskType.Other;
    }
  }

  /**
   * Convert string to TokenEnforcementMode enum
   * @param mode String representation of enforcement mode
   * @returns TokenEnforcementMode enum
   */
  static stringToTokenEnforcementMode(mode: string): TokenEnforcementMode {
    switch (mode.toLowerCase()) {
      case 'none': return TokenEnforcementMode.None;
      case 'warn': return TokenEnforcementMode.Warn;
      case 'soft': return TokenEnforcementMode.Soft;
      case 'hard': return TokenEnforcementMode.Hard;
      case 'always': return TokenEnforcementMode.Always;
      case 'never': return TokenEnforcementMode.Never;
      case 'role_based': return TokenEnforcementMode.RoleBased;
      case 'mode_based': return TokenEnforcementMode.ModeBased;
      case 'strict': return TokenEnforcementMode.Strict;
      default: return TokenEnforcementMode.Soft;
    }
  }

  /**
   * Convert TokenEnforcementMode to database string format
   * @param mode TokenEnforcementMode enum
   * @returns String for database
   */
  static tokenEnforcementModeToString(mode: TokenEnforcementMode): string {
    return mode.toString();
  }

  /**
   * Convert chat mode enum to database string format
   * @param mode ChatMode enum
   * @returns String for database
   */
  static chatModeForDatabase(mode: ChatMode): string {
    return mode.toString();
  }

  /**
   * Safely parse any enum value with fallback
   * @param enumName Target enum name
   * @param value String value to parse
   * @param fallback Optional fallback value
   * @returns Parsed enum value or fallback
   */
  static safeParse(enumName: string, value: string, fallback?: string): any {
    switch (enumName) {
      case 'ChatMode':
        return this.stringToChatMode(value);
      case 'MessageType':
        return this.stringToMessageType(value);
      case 'MessageRole':
        return this.stringToMessageRole(value);
      case 'TaskType':
        return this.stringToTaskType(value);
      case 'TokenEnforcementMode':
        return this.stringToTokenEnforcementMode(value);
      default:
        return fallback || value;
    }
  }
}
