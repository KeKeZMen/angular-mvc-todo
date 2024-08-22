import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '@models';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject$ = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject$.asObservable();

  private isAllTasksCompletedSubject$ = new BehaviorSubject<boolean>(false);
  public isAllTasksCompleted$ = this.isAllTasksCompletedSubject$.asObservable();

  public createTask(text: string) {
    this.isAllTasksCompletedSubject$.next(false);

    this.tasksSubject$.next([
      ...this.tasksSubject$.value,
      {
        id: Date.now().toString(),
        text,
        status: TaskStatus.ACTIVE,
      },
    ]);

    return this.tasks$;
  }

  public getTasks(status: TaskStatus | 'ALL') {
    return this.tasks$.pipe(
      map((tasks) =>
        status === 'ALL'
          ? tasks
          : tasks.filter((task) => task.status === status)
      )
    );
  }

  public updateTaskText(taskId: string, text: string) {
    this.tasksSubject$.next([
      ...this.tasksSubject$.value.map((task) => {
        if (task.id === taskId) task.text = text;

        return task;
      }),
    ]);

    return this.tasks$;
  }

  public changeTaskStatus(taskId: string) {
    this.tasksSubject$.next([
      ...this.tasksSubject$.value.map((task) => {
        if (task.id === taskId) {
          task.status === TaskStatus.ACTIVE
            ? (task.status = TaskStatus.COMPLETED)
            : (task.status = TaskStatus.ACTIVE);
        }

        return task;
      }),
    ]);

    if (
      this.tasksSubject$.value.some((task) => task.status === TaskStatus.ACTIVE)
    ) {
      this.isAllTasksCompletedSubject$.next(false);
    } else {
      this.isAllTasksCompletedSubject$.next(true);
    }

    return this.tasks$;
  }

  public toggleAllTasks() {
    this.isAllTasksCompletedSubject$.next(
      !this.isAllTasksCompletedSubject$.value
    );

    this.tasksSubject$.next([
      ...this.tasksSubject$.value.map((task) => ({
        ...task,
        status: this.isAllTasksCompletedSubject$.value
          ? TaskStatus.ACTIVE
          : TaskStatus.COMPLETED,
      })),
    ]);

    return this.tasks$;
  }

  public removeTask(taskId: string) {
    this.tasksSubject$.next([
      ...this.tasksSubject$.value.filter((task) => task.id !== taskId),
    ]);

    if (
      this.tasksSubject$.value.every(
        (task) => task.status === TaskStatus.COMPLETED
      )
    )
      this.isAllTasksCompletedSubject$.next(true);

    return this.tasks$;
  }

  public removeCompletedTasks() {
    this.tasks = this.tasks.filter(
      (task) => task.status !== TaskStatus.COMPLETED
    );
    this.tasksSubject$.next(this.tasks);
    this.isAllTasksCompletedSubject$.next(false);
  }
}
