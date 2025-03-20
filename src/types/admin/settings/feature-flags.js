// Define the known feature flags in the system
export var KnownFeatureFlag;
(function (KnownFeatureFlag) {
    KnownFeatureFlag["DEV_MODE"] = "dev_mode";
    KnownFeatureFlag["BETA_FEATURES"] = "beta_features";
    KnownFeatureFlag["AI_FEATURES"] = "ai_features";
    KnownFeatureFlag["GITHUB_INTEGRATION"] = "github_integration";
    KnownFeatureFlag["RAG_SUPPORT"] = "rag_support";
    KnownFeatureFlag["TOKEN_ENFORCEMENT"] = "token_enforcement";
    KnownFeatureFlag["EXPERIMENTAL"] = "experimental";
    KnownFeatureFlag["CODE_ASSISTANT"] = "code_assistant";
    KnownFeatureFlag["GITHUB_SYNC"] = "github_sync";
    KnownFeatureFlag["NOTIFICATIONS"] = "notifications";
    KnownFeatureFlag["TOKEN_CONTROL"] = "token_control";
    // Adding the missing feature flags that are used in ChatState features
    KnownFeatureFlag["VOICE"] = "voice";
    KnownFeatureFlag["RAG"] = "rag";
    KnownFeatureFlag["MODE_SWITCH"] = "mode_switch";
})(KnownFeatureFlag || (KnownFeatureFlag = {}));
// Mapping from KnownFeatureFlag to ChatFeatureKey
export const featureFlagToChatFeature = {
    [KnownFeatureFlag.VOICE]: 'voice',
    [KnownFeatureFlag.RAG]: 'rag',
    [KnownFeatureFlag.MODE_SWITCH]: 'modeSwitch',
    [KnownFeatureFlag.NOTIFICATIONS]: 'notifications',
    [KnownFeatureFlag.GITHUB_INTEGRATION]: 'github',
    [KnownFeatureFlag.CODE_ASSISTANT]: 'codeAssistant',
    [KnownFeatureFlag.RAG_SUPPORT]: 'ragSupport',
    [KnownFeatureFlag.GITHUB_SYNC]: 'githubSync',
    [KnownFeatureFlag.TOKEN_ENFORCEMENT]: 'tokenEnforcement',
    [KnownFeatureFlag.TOKEN_CONTROL]: 'tokenEnforcement',
    [KnownFeatureFlag.DEV_MODE]: null,
    [KnownFeatureFlag.BETA_FEATURES]: null,
    [KnownFeatureFlag.AI_FEATURES]: null,
    [KnownFeatureFlag.EXPERIMENTAL]: null
};
// Helper to convert between feature flag types
export function mapFeatureFlagToChat(flag) {
    return featureFlagToChatFeature[flag];
}
export function isChatFeatureKey(key) {
    return [
        'voice', 'rag', 'modeSwitch', 'notifications', 'github',
        'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'
    ].includes(key);
}
