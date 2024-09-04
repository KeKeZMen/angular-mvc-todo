import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './models';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskService {
  private apiUrl = 'http://localhost:4200/tasks';

  public tasks$ = new Observable<Task[]>();

  private isAllTasksCompletedSubject$ = new BehaviorSubject<boolean>(false);
  public isAllTasksCompleted$ = this.isAllTasksCompletedSubject$.asObservable();

  constructor(private httpClient: HttpClient) {}

  public createTask(text: string) {
    this.tasks$ = this.httpClient.post(this.apiUrl, { text }).pipe(
      switchMap(() =>
        this.httpClient.get<Task[]>(this.apiUrl).pipe(
          tap((tasks) => {
            this.isAllTasksCompletedSubject$.next(
              tasks.every((task) => task.status === TaskStatus.COMPLETED)
            );
          })
        )
      )
    );

    return this.tasks$;
  }

  public getTasks(status: TaskStatus | 'ALL') {
    this.tasks$ = this.httpClient.get<Task[]>(
      `${this.apiUrl}?status=${status}`
    );

    return this.tasks$;
  }

  public updateTaskText(taskId: string, text: string) {
    this.tasks$ = this.httpClient
      .patch(`${this.apiUrl}?id=${taskId}`, { text })
      .pipe(
        switchMap(() => {
          return this.httpClient.get<Task[]>(this.apiUrl);
        })
      );

    return this.tasks$;
  }

  public changeTaskStatus(taskId: string) {
    this.tasks$ = this.httpClient.patch(`${this.apiUrl}?id=${taskId}`, {}).pipe(
      switchMap(() => {
        return this.httpClient.get<Task[]>(this.apiUrl).pipe(
          tap((tasks) => {
            this.isAllTasksCompletedSubject$.next(
              tasks.every((task) => task.status === TaskStatus.COMPLETED)
            );
          })
        );
      })
    );

    return this.tasks$;
  }

  public removeTask(taskId: string) {
    this.tasks$ = this.httpClient.delete(`${this.apiUrl}?id=${taskId}`).pipe(
      switchMap(() => {
        return this.httpClient.get<Task[]>(this.apiUrl).pipe(
          tap((tasks) => {
            this.isAllTasksCompletedSubject$.next(
              tasks.every((task) => task.status === TaskStatus.COMPLETED)
            );
          })
        );
      })
    );

    return this.tasks$;
  }

  public removeCompletedTasks() {
    this.tasks$ = this.httpClient.delete(`${this.apiUrl}?all=true`).pipe(
      switchMap(() => {
        return this.httpClient.get<Task[]>(this.apiUrl).pipe(
          tap(() => {
            this.isAllTasksCompletedSubject$.next(false);
          })
        );
      })
    );

    return this.tasks$;
  }
}
