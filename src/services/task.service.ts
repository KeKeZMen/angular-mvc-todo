import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '@models';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject$ = new BehaviorSubject<Task[]>([]);
  public tasksObservable$ = this.tasksSubject$.asObservable();

  private isAllTasksCompletedSubject$ = new BehaviorSubject<boolean>(false);
  public isAllTasksCompleted$ = this.isAllTasksCompletedSubject$.asObservable();

  public createTask(text: string) {
    this.tasks.push({
      id: Date.now().toString(),
      text,
      status: TaskStatus.ACTIVE,
    });

    this.isAllTasksCompletedSubject$.next(false);

    this.tasksSubject$.next(this.tasks);
  }

  public getTasks(status: TaskStatus | 'ALL') {
    return this.tasksObservable$.pipe(
      map((tasks) =>
        status === 'ALL'
          ? tasks
          : tasks.filter((task) => task.status === status)
      )
    );
  }

  public updateTaskText(taskId: string, text: string) {
    this.tasks[this.tasks.findIndex((task) => task.id === taskId)].text = text;
    this.tasksSubject$.next(this.tasks);
  }

  public changeTaskStatus(taskId: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    this.tasks[taskIndex].status == TaskStatus.ACTIVE
      ? (this.tasks[taskIndex].status = TaskStatus.COMPLETED)
      : (this.tasks[taskIndex].status = TaskStatus.ACTIVE);

    if (this.tasks.some((task) => task.status === TaskStatus.ACTIVE))
      this.isAllTasksCompletedSubject$.next(false);
    else this.isAllTasksCompletedSubject$.next(true);

    this.tasksSubject$.next(this.tasks);
  }

  public toggleAllTasks() {
    this.tasks = this.tasks.map((task) => ({
      id: task.id,
      status: this.isAllTasksCompletedSubject$.value
        ? TaskStatus.ACTIVE
        : TaskStatus.COMPLETED,
      text: task.text,
    }));

    this.isAllTasksCompletedSubject$.next(!this.isAllTasksCompletedSubject$.value);

    this.tasksSubject$.next(this.tasks);
  }

  public removeTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    if (this.tasks.every((task) => task.status === TaskStatus.COMPLETED))
      this.isAllTasksCompletedSubject$.next(true);

    this.tasksSubject$.next(this.tasks);
  }

  public removeCompletedTasks() {
    this.tasks = this.tasks.filter(
      (task) => task.status !== TaskStatus.COMPLETED
    );
    this.tasksSubject$.next(this.tasks);
    this.isAllTasksCompletedSubject$.next(false);
  }
}
