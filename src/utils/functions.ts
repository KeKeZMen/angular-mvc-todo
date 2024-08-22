import { ChangeDetectorRef } from '@angular/core';
import { TaskStatus } from '@models';
import { MonoTypeOperatorFunction, tap } from 'rxjs';

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

export const watchChanges = <T>(
  ref: ChangeDetectorRef
): MonoTypeOperatorFunction<T> => {
  return tap(() => ref.markForCheck());
};
