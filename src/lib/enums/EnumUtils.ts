
import { 
  ChatMode, 
  MessageRole, 
  MessageStatus, 
  MessageType,
  TokenEnforcementMode,
  TaskType
} from '@/components/chat/types/chat/enums';
import { chatModeToDbString, dbStringToChatMode } from '@/components/chat/types/chat/conversation';

/**
 * Type representing UI-friendly chat modes
 */
export type UiChatMode = 'chat' | 'dev' | 'image' | 'training' | 'code' | 'document' | 'audio' | 'planning';

/**
 * Utility functions for enum handling
 */
export const EnumUtils = {
  /**
   * Convert a string to a ChatMode enum value
   */
  stringToChatMode(mode: string): ChatMode {
    switch ((mode || '').toLowerCase()) {
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
  },

  /**
   * Convert a ChatMode enum to a string
   */
  chatModeToString(mode: ChatMode): string {
    return mode.toString();
  },

  /**
   * Convert a ChatMode to a UI-friendly mode name
   */
  chatModeToUiMode(mode: ChatMode): UiChatMode {
    switch (mode) {
      case ChatMode.Chat: return 'chat';
      case ChatMode.Dev:
      case ChatMode.Editor: return 'dev';
      case ChatMode.Image: return 'image';
      case ChatMode.Training: return 'training';
      case ChatMode.Planning: return 'planning';
      case ChatMode.Code: return 'code';
      case ChatMode.Document: return 'document';
      case ChatMode.Audio: return 'audio';
      default: return 'chat';
    }
  },

  /**
   * Convert a UI mode to ChatMode enum
   */
  uiModeToChatMode(mode: UiChatMode): ChatMode {
    switch (mode) {
      case 'chat': return ChatMode.Chat;
      case 'dev': return ChatMode.Dev;
      case 'image': return ChatMode.Image;
      case 'training': return ChatMode.Training;
      case 'planning': return ChatMode.Planning;
      case 'code': return ChatMode.Code;
      case 'document': return ChatMode.Document;
      case 'audio': return ChatMode.Audio;
      default: return ChatMode.Chat;
    }
  },

  /**
   * Convert a MessageRole enum to a string
   */
  messageRoleToString(role: MessageRole): string {
    return role.toString();
  },

  /**
   * Convert a string to a MessageRole enum value
   */
  stringToMessageRole(role: string): MessageRole {
    switch ((role || '').toLowerCase()) {
      case 'user': return MessageRole.User;
      case 'assistant': return MessageRole.Assistant;
      case 'system': return MessageRole.System;
      case 'error': return MessageRole.Error;
      case 'tool': return MessageRole.Tool;
      case 'function': return MessageRole.Function;
      default: return MessageRole.User;
    }
  },

  /**
   * Convert a MessageType enum to a string
   */
  messageTypeToString(type: MessageType): string {
    return type.toString();
  },

  /**
   * Convert a string to a MessageType enum value
   */
  stringToMessageType(type: string): MessageType {
    switch ((type || '').toLowerCase()) {
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
  },

  /**
   * Convert a MessageStatus enum to a string
   */
  messageStatusToString(status: MessageStatus): string {
    return status.toString();
  },

  /**
   * Convert a string to a MessageStatus enum value
   */
  stringToMessageStatus(status: string): MessageStatus {
    switch ((status || '').toLowerCase()) {
      case 'pending': return MessageStatus.Pending;
      case 'sending': return MessageStatus.Sending;
      case 'sent': return MessageStatus.Sent;
      case 'received': return MessageStatus.Received;
      case 'error': return MessageStatus.Error;
      case 'failed': return MessageStatus.Failed;
      case 'retrying': return MessageStatus.Retrying;
      case 'cached': return MessageStatus.Cached;
      case 'canceled': return MessageStatus.Canceled;
      case 'delivered': return MessageStatus.Delivered;
      default: return MessageStatus.Pending;
    }
  },

  /**
   * Convert a chatmode to database string format
   */
  chatModeForDatabase(mode: ChatMode): string {
    return chatModeToDbString(mode);
  },

  /**
   * Convert database string to ChatMode enum
   */
  databaseStringToChatMode(mode: string): ChatMode {
    return dbStringToChatMode(mode);
  },

  /**
   * Convert a string to a TokenEnforcementMode enum value
   */
  stringToTokenEnforcementMode(mode: string): TokenEnforcementMode {
    switch ((mode || '').toLowerCase()) {
      case 'none': return TokenEnforcementMode.None;
      case 'warn': return TokenEnforcementMode.Warn;
      case 'soft': return TokenEnforcementMode.Soft;
      case 'hard': return TokenEnforcementMode.Hard;
      case 'always': return TokenEnforcementMode.Always;
      case 'never': return TokenEnforcementMode.Never;
      case 'role_based': return TokenEnforcementMode.RoleBased;
      case 'mode_based': return TokenEnforcementMode.ModeBased;
      case 'strict': return TokenEnforcementMode.Strict;
      default: return TokenEnforcementMode.Warn;
    }
  },

  /**
   * Convert a string to TaskType enum
   */
  stringToTaskType(type: string): TaskType {
    switch ((type || '').toLowerCase()) {
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
      case 'code_explanation': return TaskType.CodeExplanation;
      case 'bug_fix': return TaskType.BugFix;
      case 'code_review': return TaskType.CodeReview;
      case 'refactoring': return TaskType.Refactoring;
      case 'project_context': return TaskType.ProjectContext;
      case 'image_editing': return TaskType.ImageEditing;
      case 'document_search': return TaskType.DocumentSearch;
      case 'tutoring': return TaskType.Tutoring;
      case 'problem_solving': return TaskType.ProblemSolving;
      case 'explanation': return TaskType.Explanation;
      case 'conversation': return TaskType.Conversation;
      default: return TaskType.Other;
    }
  },

  /**
   * Get a user-friendly label for a ChatMode
   */
  getChatModeLabel(mode: ChatMode): string {
    switch (mode) {
      case ChatMode.Chat: return 'Chat';
      case ChatMode.Dev: return 'Development';
      case ChatMode.Editor: return 'Editor';
      case ChatMode.Image: return 'Image Generation';
      case ChatMode.Training: return 'Training';
      case ChatMode.Planning: return 'Planning';
      case ChatMode.Code: return 'Code Assistant';
      case ChatMode.Document: return 'Document';
      case ChatMode.Audio: return 'Audio';
      default: return 'Chat';
    }
  },

  /**
   * Safely parse a string to an enum with fallback
   */
  safeParse(enumName: string, value: string, fallback: string = ''): any {
    try {
      switch (enumName.toLowerCase()) {
        case 'chatmode':
          return this.stringToChatMode(value);
        case 'messagerole':
          return this.stringToMessageRole(value);
        case 'messagetype':
          return this.stringToMessageType(value);
        case 'messagestatus':
          return this.stringToMessageStatus(value);
        case 'tasktype':
          return this.stringToTaskType(value);
        case 'tokenenforcement':
          return this.stringToTokenEnforcementMode(value);
        default:
          return fallback;
      }
    } catch (error) {
      console.error(`Error parsing enum ${enumName} with value ${value}`, error);
      return fallback;
    }
  }
};
