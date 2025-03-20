export function createProviderActions(set, get) {
    return {
        updateChatProvider: (providers) => {
            set(state => ({
                availableProviders: providers,
            }), false, { type: 'updateChatProvider', providers });
        },
        updateCurrentProvider: (provider) => {
            set(state => ({
                currentProvider: provider,
            }), false, { type: 'updateCurrentProvider', provider });
        },
        updateAvailableProviders: (providers) => {
            set(state => ({
                availableProviders: providers,
            }), false, { type: 'updateAvailableProviders', providers });
        },
    };
}
