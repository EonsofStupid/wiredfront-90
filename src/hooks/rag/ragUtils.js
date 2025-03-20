/**
 * Utility functions for RAG operations
 */
export const ragUtils = {
    /**
     * Calculate usage percentage based on vector count and max vectors
     */
    calculateUsagePercentage: (vectorCount, maxVectors) => {
        if (!maxVectors)
            return 0;
        return Math.round((vectorCount / maxVectors) * 100);
    },
    /**
     * Check if vector usage is at limit (95% or higher)
     */
    isAtVectorLimit: (vectorCount, maxVectors) => {
        if (!maxVectors)
            return false;
        return (vectorCount / maxVectors) >= 0.95; // 95% or higher
    },
    /**
     * Check if vector usage is approaching limit (85% or higher)
     */
    isApproachingLimit: (vectorCount, maxVectors) => {
        if (!maxVectors)
            return false;
        return (vectorCount / maxVectors) >= 0.85; // 85% or higher
    }
};
