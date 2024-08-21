import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '@models';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks: Task[] = [];
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  public tasks$ = this._tasks$.asObservable();

  private _isAllTasksCompleted$ = new BehaviorSubject<boolean>(false);
  public isAllTasksCompleted$ = this._isAllTasksCompleted$.asObservable();

  public createTask(text: string) {
    this._tasks.push({
      id: Date.now().toString(),
      text,
      status: TaskStatus.ACTIVE,
    });

    this._isAllTasksCompleted$.next(false);

    this._tasks$.next(this._tasks);
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
    this._tasks[this._tasks.findIndex((task) => task.id === taskId)].text =
      text;
    this._tasks$.next(this._tasks);
  }

  public changeTaskStatus(taskId: string) {
    const taskIndex = this._tasks.findIndex((task) => task.id === taskId);
    this._tasks[taskIndex].status == TaskStatus.ACTIVE
      ? (this._tasks[taskIndex].status = TaskStatus.COMPLETED)
      : (this._tasks[taskIndex].status = TaskStatus.ACTIVE);

    if (this._tasks.some((task) => task.status === TaskStatus.ACTIVE))
      this._isAllTasksCompleted$.next(false);
    else this._isAllTasksCompleted$.next(true);

    this._tasks$.next(this._tasks);
  }

  public toggleAllTasks() {
    this._tasks = this._tasks.map((task) => ({
      id: task.id,
      status: this._isAllTasksCompleted$.value
        ? TaskStatus.ACTIVE
        : TaskStatus.COMPLETED,
      text: task.text,
    }));

    this._isAllTasksCompleted$.next(!this._isAllTasksCompleted$.value);

    this._tasks$.next(this._tasks);
  }

  public removeTask(taskId: string) {
    this._tasks = this._tasks.filter((task) => task.id !== taskId);

    if (this._tasks.every((task) => task.status === TaskStatus.COMPLETED))
      this._isAllTasksCompleted$.next(true);

    this._tasks$.next(this._tasks);
  }

  public removeCompletedTasks() {
    this._tasks = this._tasks.filter(
      (task) => task.status !== TaskStatus.COMPLETED
    );
    this._tasks$.next(this._tasks);
    this._isAllTasksCompleted$.next(false);
  }
}
