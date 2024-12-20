import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { Task, TaskConfig } from "@/types/tasks/core";
import type { TaskStatusUpdate } from "@/types/tasks/status";
import type { Database } from "@/integrations/supabase/types";

type TaskInsert = Database["public"]["Tables"]["ai_tasks"]["Insert"];
type Json = Database["public"]["Tables"]["ai_tasks"]["Insert"]["metadata"];

const mapToCamelCase = (data: Record<string, any>): Record<string, any> => {
  const camelCase: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelCase[camelKey] = value;
  });
  return camelCase;
};

export const createTask = async (config: TaskConfig): Promise<Task> => {
  const taskData: TaskInsert = {
    task_id: uuidv4(),
    type: config.type,
    prompt: config.prompt,
    provider: config.provider,
    status: 'pending',
    priority: config.priority || 5,
    scheduled_for: config.scheduledFor?.toISOString(),
    metadata: config.metadata as Json || {},
    retry_count: 0,
  };

  const { data, error } = await supabase
    .from('ai_tasks')
    .insert(taskData)
    .select()
    .single();

  if (error) throw error;
  return mapToCamelCase(data) as Task;
};

export const getNextTask = async (): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return mapToCamelCase(data) as Task;
};

export const updateTaskStatus = async (
  taskId: string,
  update: TaskStatusUpdate
): Promise<Task> => {
  const updateData = {
    status: update.status,
    result: update.result,
    error_message: update.errorMessage,
    completed_at: update.completedAt?.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('ai_tasks')
    .update(updateData)
    .eq('task_id', taskId)
    .select()
    .single();

  if (error) throw error;
  return mapToCamelCase(data) as Task;
};

export const getTasksByStatus = async (status: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(task => mapToCamelCase(task)) as Task[];
};

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .eq('task_id', taskId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapToCamelCase(data) as Task;
};