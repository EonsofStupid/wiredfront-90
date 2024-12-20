export type TaskStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'scheduled';

export interface TaskStatusUpdate {
  status: TaskStatus;
  result?: string;
  errorMessage?: string;
  completedAt?: Date;
}