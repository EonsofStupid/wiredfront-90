import { pipeline, type Pipeline } from "@huggingface/transformers";

export type AIModel = {
  id: string;
  name: string;
  provider: "openai" | "huggingface" | "custom";
  type: "text" | "image" | "audio";
  status: "active" | "loading" | "error";
};

export type AIResponse = {
  result: string | object;
  metadata?: {
    model: string;
    processingTime: number;
    confidence?: number;
  };
};

// Initialize HuggingFace pipeline
export const initializeHFPipeline = async (
  task: "text-classification" | "feature-extraction" | "sentiment-analysis",
  model = "onnx-community/distilbert-base-uncased"
) => {
  try {
    return await pipeline(task, model, { device: "webgpu" });
  } catch (error) {
    console.error("Error initializing HuggingFace pipeline:", error);
    throw error;
  }
};

// Process text with HuggingFace
export const processWithHuggingFace = async (
  text: string,
  task: "text-classification" | "feature-extraction" | "sentiment-analysis" = "text-classification",
  model = "onnx-community/distilbert-base-uncased"
) => {
  try {
    const classifier = await initializeHFPipeline(task, model);
    const result = await classifier(text);
    return {
      result,
      metadata: {
        model,
        processingTime: Date.now(),
      },
    };
  } catch (error) {
    console.error("Error processing with HuggingFace:", error);
    throw error;
  }
};