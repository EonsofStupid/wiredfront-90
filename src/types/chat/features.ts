/**
 * Feature types for the chat system
 */

export type FeatureKey =
  | "code_completion"
  | "code_explanation"
  | "code_generation"
  | "code_review"
  | "code_search"
  | "documentation"
  | "error_analysis"
  | "refactoring"
  | "testing"
  | "translation";

export type ChatFeatureKey =
  | "enableCodeCompletion"
  | "enableCodeExplanation"
  | "enableCodeGeneration"
  | "enableCodeReview"
  | "enableCodeSearch"
  | "enableDocumentation"
  | "enableErrorAnalysis"
  | "enableRefactoring"
  | "enableTesting"
  | "enableTranslation";

export interface FeatureState {
  features: Record<ChatFeatureKey, boolean>;
  toggleFeature: (key: ChatFeatureKey) => void;
  enableFeature: (key: ChatFeatureKey) => void;
  disableFeature: (key: ChatFeatureKey) => void;
  setFeatureState: (key: ChatFeatureKey, enabled: boolean) => void;
}

/**
 * Converts a FeatureKey to its corresponding ChatFeatureKey
 */
export function convertFeatureKeyToChatFeature(
  key: FeatureKey
): ChatFeatureKey | null {
  const mapping: Record<FeatureKey, ChatFeatureKey> = {
    code_completion: "enableCodeCompletion",
    code_explanation: "enableCodeExplanation",
    code_generation: "enableCodeGeneration",
    code_review: "enableCodeReview",
    code_search: "enableCodeSearch",
    documentation: "enableDocumentation",
    error_analysis: "enableErrorAnalysis",
    refactoring: "enableRefactoring",
    testing: "enableTesting",
    translation: "enableTranslation",
  };

  return mapping[key] || null;
}
