import { TaskStatus } from '@models';

export const convertToStatus = (str: string): TaskStatus | null => {
  switch (str.toLowerCase()) {
    case 'active':
      return TaskStatus.ACTIVE;
    case 'completed':
      return TaskStatus.COMPLETED;
    default:
      return null;
  }
};
