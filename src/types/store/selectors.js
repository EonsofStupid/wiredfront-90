// Create a memoized selector
export const createMemoizedSelector = (selector) => {
    let cache = null;
    const memoizedSelector = (state) => {
        if (cache && cache.input === state) {
            return cache.output;
        }
        const result = selector(state);
        cache = { input: state, output: result };
        return result;
    };
    memoizedSelector.reset = () => {
        cache = null;
    };
    return memoizedSelector;
};
