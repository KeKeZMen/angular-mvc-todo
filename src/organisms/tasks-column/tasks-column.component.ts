import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskStatus } from '@models';
import { TaskService } from '@services';
import { convertToStatus } from '@utils';
import { Observable, map, Subject, takeUntil, combineLatest } from 'rxjs';

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
    return this.statusSubject$.pipe(
      switchMap((status) => this.taskService.getTasks(status))
    );
  }

  public ngOnInit(): void {
    this.filteredTasks$ = this.route.paramMap.pipe(
      switchMap((paramMap) => {
        const paramsStatus = paramMap.get('status');
        this.statusSubject$.next(convertToStatus(paramsStatus) ?? 'ALL');
        return this.getTasksByStatus();
      })
    );

    this.tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasksCount = tasks.length;
      this.incompletedTasksCount = tasks.filter(
        (task) => task.status === TaskStatus.ACTIVE
      ).length;
    });

    this.hasTasks$ = this.filteredTasks$.pipe(map((tasks) => tasks.length > 0));

    this.toggledAllTasks$ = this.taskService.isAllTasksCompleted$;
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

  public ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }
}
