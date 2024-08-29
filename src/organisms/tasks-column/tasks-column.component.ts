import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskStatus } from '@models';
import { TaskService } from '@services';
import { convertToStatus, watchChanges } from '@utils';
import { Observable, map, Subject, takeUntil, combineLatest } from 'rxjs';

@Component({
  selector: 'app-tasks-column',
  templateUrl: './tasks-column.component.html',
  styleUrl: './tasks-column.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksColumnComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();

  public filteredTasks$ = new Observable<Task[]>();

  public hasTasks$ = new Observable<boolean>();
  public toggledAllTasks = false;

  public tasksCount: number = 0;
  public incompletedTasksCount: number = 0;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    combineLatest([this.route.paramMap, this.taskService.tasks$])
      .pipe(takeUntil(this.unsubscribe$), watchChanges(this.cdr))
      .subscribe(([paramMap, tasks]) => {
        this.tasksCount = tasks.length;
        this.incompletedTasksCount = tasks.filter(
          (task) => task.status === TaskStatus.ACTIVE
        ).length;

        const status: TaskStatus | 'ALL' =
          convertToStatus(paramMap.get('status')) ?? 'ALL';
        this.filteredTasks$ = this.taskService.getTasks(status);

        this.hasTasks$ = this.filteredTasks$.pipe(
          map((tasks) => tasks.length > 0)
        );
        this.toggledAllTasks = tasks.every(
          (task) => task.status === TaskStatus.COMPLETED
        );
      });
  }

  public changeTaskStatus(taskId: string) {
    this.taskService.changeTaskStatus(taskId);
  }

  public removeTask(taskId: string) {
    this.taskService.removeTask(taskId);
  }

  public updateTaskText(task: Task) {
    this.taskService.updateTaskText(task.id, task.text);
  }

  public toggleAllTasks() {
    this.taskService.toggleAllTasks();
  }

  public removeCompletedTasks() {
    this.taskService.removeCompletedTasks();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }
}
