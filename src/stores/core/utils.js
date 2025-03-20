export const createAction = (type, payload) => ({
    type,
    payload,
});
export const exists = (value) => {
    return value !== null && value !== undefined;
};
export const createTimestamp = () => Date.now();
export const getPropSafely = (obj, key) => {
    return obj[key];
};
export const deepMerge = (target, source) => {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                }
                else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            }
            else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
};
const isObject = (item) => {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item));
};
