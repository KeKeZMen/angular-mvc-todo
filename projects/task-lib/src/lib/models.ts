export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
}

export enum TaskStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}
