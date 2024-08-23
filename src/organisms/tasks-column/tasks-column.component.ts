import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskStatus } from '@models';
import { TaskService } from '@services';
import { convertToStatus } from '@utils';
import {
  Observable,
  switchMap,
  map,
  BehaviorSubject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-tasks-column',
  templateUrl: './tasks-column.component.html',
  styleUrl: './tasks-column.component.css',
})
export class TasksColumnComponent implements OnInit, OnDestroy {
  private statusSubject$ = new BehaviorSubject<TaskStatus | 'ALL'>('ALL');

  public filteredTasks$ = new Observable<Task[]>();

  public hasTasks$ = new Observable<boolean>();
  public toggledAllTasks$ = new Observable<boolean>();

  public tasksCount: number = 0;
  public incompletedTasksCount: number = 0;
  private tasksSubscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  private getTasksByStatus() {
    return this.taskService.getTasks(this.status).pipe(
      tap((tasks) => {
        this.hasTasks = tasks.length > 0;
        this.cdr.markForCheck();
      })
    );
  }

  public ngOnInit(): void {
    this.tasksSubscription = this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const paramsStatus = paramMap.get('status');

          if (paramsStatus) {
            this.status = convertToStatus(paramsStatus) ?? 'ALL';
          }

          return (this.filteredTasks$ = this.getTasksByStatus());
        })
      )
      .subscribe();

    this.taskService.isAllTasksCompleted$.subscribe((isToggled) => {
      this.toggledAllTasks = isToggled;
    });

    this.taskService.tasks$.subscribe((tasks) => {
      this.incompletedTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.ACTIVE
      ).length;
    });
  }

  public changeTaskStatus(taskId: string) {
    this.filteredTasks$ = this.taskService
      .changeTaskStatus(taskId)
      .pipe(switchMap(() => this.getTasksByStatus()));
  }

  public removeTask(taskId: string) {
    this.filteredTasks$ = this.taskService
      .removeTask(taskId)
      .pipe(switchMap(() => this.getTasksByStatus()));
  }

  public updateTaskText(task: Task) {
    this.filteredTasks$ = this.taskService
      .updateTaskText(task.id, task.text)
      .pipe(switchMap(() => this.getTasksByStatus()));
  }

  public toggleAllTasks() {
    this.filteredTasks$ = this.taskService
      .toggleAllTasks()
      .pipe(switchMap(() => this.getTasksByStatus()));
  }

  public removeCompletedTasks() {
    this.filteredTasks$ = this.taskService
      .removeCompletedTasks()
      .pipe(switchMap(() => this.getTasksByStatus()));
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.isAllTasksCompletedSubscription.unsubscribe();
  }
}
