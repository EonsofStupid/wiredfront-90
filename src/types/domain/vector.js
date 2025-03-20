/**
 * Domain types for vector database configurations
 */
// Helper to create a vector configuration ID
export function createVectorConfigId() {
    return crypto.randomUUID();
}
