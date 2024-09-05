import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './models';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api/tasks';

  private tasksSubject$ = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject$.asObservable();

  public createTask(text: string) {
    return this.httpClient.post<Task>(this.apiUrl, { text }).pipe(
      tap((task) =>
        this.tasksSubject$.next([...this.tasksSubject$.value, task])
      ),
      catchError((err) => throwError(() => err))
    );
  }

  public loadTasks() {
    return this.httpClient.get<Task[]>(this.apiUrl).pipe(
      tap((tasks) => this.tasksSubject$.next(tasks)),
      catchError((err) => throwError(() => err))
    );
  }

  public filterTasks(status: TaskStatus | 'ALL') {
    return this.tasks$.pipe(
      map((tasks) =>
        status === 'ALL'
          ? tasks
          : tasks.filter((task) => task.status === status)
      )
    );
  }

  public updateTaskText(id: string, text: string) {
    return this.httpClient
      .patch<Task[]>(this.apiUrl, { text }, { params: { id } })
      .pipe(
        tap((tasks) => {
          this.tasksSubject$.next(tasks);
        }),
        catchError((err) => throwError(() => err))
      );
  }

  public changeTaskStatus(id: string) {
    return this.httpClient
      .patch<Task[]>(this.apiUrl, {}, { params: { id } })
      .pipe(
        tap((tasks) => this.tasksSubject$.next(tasks)),
        catchError((err) => throwError(() => err))
      );
  }

  public toggleAllTasks() {
    return this.httpClient
      .patch<Task[]>(this.apiUrl, {}, { params: { all: true } })
      .pipe(
        tap((tasks) => this.tasksSubject$.next(tasks)),
        catchError((err) => throwError(() => err))
      );
  }

  public removeTask(id: string) {
    return this.httpClient.delete<Task[]>(this.apiUrl, { params: { id } }).pipe(
      tap((tasks) => this.tasksSubject$.next(tasks)),
      catchError((err) => throwError(() => err))
    );
  }

  public removeCompletedTasks() {
    return this.httpClient
      .delete<Task[]>(this.apiUrl, { params: { all: true } })
      .pipe(
        tap((tasks) => this.tasksSubject$.next(tasks)),
        catchError((err) => throwError(() => err))
      );
  }
}
