import type { AIProvider } from "../ai";
import type { TaskStatus } from "./status";

export type TaskType = 'code' | 'analysis' | 'automation' | 'data';
export type TaskPriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TaskMetadata {
  source?: string;
  tags?: string[];
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Task {
  id: string;
  taskId: string;
  type: TaskType;
  prompt: string;
  provider: AIProvider;
  status: TaskStatus;
  result?: string;
  userId?: string;
  priority: TaskPriority;
  scheduledFor?: Date;
  completedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  metadata: TaskMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskConfig {
  type: TaskType;
  prompt: string;
  provider: AIProvider;
  priority?: TaskPriority;
  scheduledFor?: Date;
  metadata?: TaskMetadata;
}