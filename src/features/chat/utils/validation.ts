
import { toast } from "sonner";
import { 
  ChatSessionFile, 
  ChatSessionMetadata, 
  validateChatSessionFile, 
  validateChatSessionMetadata 
} from "../types";

// Maximum allowed total storage per session (50MB)
export const MAX_SESSION_STORAGE = 50 * 1024 * 1024;

// Calculate total storage used by files in a session
export const calculateSessionStorage = (files: ChatSessionFile[] = []): number => {
  return files.reduce((total, file) => total + file.size, 0);
};

// Check if adding a file would exceed session storage limits
export const checkSessionStorageLimit = (
  files: ChatSessionFile[] = [], 
  newFileSize: number
): boolean => {
  const currentStorage = calculateSessionStorage(files);
  return (currentStorage + newFileSize) <= MAX_SESSION_STORAGE;
};

// Validate file before adding to session
export const validateFileUpload = (
  file: Omit<ChatSessionFile, 'id' | 'session_id' | 'uploaded_at'>, 
  existingFiles: ChatSessionFile[] = []
): { isValid: boolean; message?: string } => {
  try {
    // Check file size against individual limit (10MB defined in schema)
    if (file.size > 10 * 1024 * 1024) {
      return { 
        isValid: false, 
        message: 'File exceeds maximum size limit of 10MB' 
      };
    }
    
    // Check total session storage limit
    if (!checkSessionStorageLimit(existingFiles, file.size)) {
      return { 
        isValid: false, 
        message: 'Adding this file would exceed your session storage limit of 50MB' 
      };
    }
    
    return { isValid: true };
  } catch (error) {
    console.error("File validation error:", error);
    return { 
      isValid: false, 
      message: 'Invalid file format' 
    };
  }
};

// Validate metadata updates
export const validateMetadataUpdate = (
  metadata: Partial<ChatSessionMetadata>
): { isValid: boolean; validatedData?: Partial<ChatSessionMetadata>; message?: string } => {
  try {
    // This will throw if invalid
    const validatedData = validateChatSessionMetadata({
      ...metadata
    });
    
    return { 
      isValid: true, 
      validatedData 
    };
  } catch (error) {
    console.error("Metadata validation error:", error);
    return { 
      isValid: false, 
      message: 'Invalid metadata format' 
    };
  }
};
