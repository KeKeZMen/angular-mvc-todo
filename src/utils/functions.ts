import { TaskStatus } from '@models';

export const convertToStatus = (str: string): TaskStatus | null => {
  switch (str) {
    case 'active':
      return TaskStatus.ACTIVE;
    case 'completed':
      return TaskStatus.COMPLETED;
    default:
      return null;
  }
};
