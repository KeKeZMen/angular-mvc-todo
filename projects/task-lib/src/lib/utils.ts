import { TaskStatus } from './models';

export const convertToStatus = (str: string | null): TaskStatus | null => {
  if (!str) return null;
  switch (str.toLowerCase()) {
    case 'active':
      return TaskStatus.ACTIVE;
    case 'completed':
      return TaskStatus.COMPLETED;
    default:
      return null;
  }
};
