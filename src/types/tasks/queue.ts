import type { Task } from "./core";

export interface TaskQueue {
  pendingTasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  failedTasks: Task[];
}

export interface QueueMetrics {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  failedCount: number;
  averageProcessingTime: number;
}