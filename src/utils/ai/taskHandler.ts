import { AIProvider } from "@/types/ai";
import { generateAIResponse } from "./aiProviders";
import { supabase } from "@/integrations/supabase/client";

export type TaskType = "code" | "analysis" | "automation" | "data";

export interface Task {
  id: string;
  type: TaskType;
  prompt: string;
  provider: AIProvider;
  status: "pending" | "processing" | "completed" | "failed";
}

export const processTask = async (task: Task) => {
  try {
    const response = await generateAIResponse(task.provider, task.prompt);
    
    // Log task completion in Supabase
    await supabase.from("ai_tasks").insert({
      task_id: task.id,
      type: task.type,
      prompt: task.prompt,
      provider: task.provider,
      status: "completed",
      result: response
    });

    return response;
  } catch (error) {
    console.error("Task processing error:", error);
    throw error;
  }
};