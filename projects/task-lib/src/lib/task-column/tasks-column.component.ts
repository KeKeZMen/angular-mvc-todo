import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskStatus } from '../models';
import { TaskService } from '../task.service';
import { convertToStatus } from '../utils';
import { Observable, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tasks-column',
  templateUrl: './tasks-column.component.html',
  styleUrls: ['./tasks-column.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksColumnComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();

  public filteredTasks$ = new Observable<Task[]>();

  public hasTasks$ = new Observable<boolean>();
  public toggledAllTasks$ = new Observable<boolean>();

  public tasksCount$ = new Observable<number>();
  public incompletedTasksCount$ = new Observable<number>();

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.taskService.loadTasks().pipe(takeUntil(this.unsubscribe$)).subscribe();

    this.filteredTasks$ = this.route.paramMap.pipe(
      switchMap((paramMap) =>
        this.taskService.filterTasks(
          convertToStatus(paramMap.get('status')) ?? 'ALL'
        )
      )
    );

    this.hasTasks$ = this.filteredTasks$.pipe(map((tasks) => tasks.length > 0));

    this.toggledAllTasks$ = this.taskService.tasks$.pipe(
      map((tasks) =>
        tasks.every((task) => task.status === TaskStatus.COMPLETED)
      )
    );

    this.tasksCount$ = this.taskService.tasks$.pipe(
      map((tasks) => tasks.length)
    );

    this.incompletedTasksCount$ = this.taskService.tasks$.pipe(
      map(
        (tasks) =>
          tasks.filter((task) => task.status === TaskStatus.ACTIVE).length
      )
    );
  }

  public changeTaskStatus(taskId: string) {
    this.taskService
      .changeTaskStatus(taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => console.log('Статус задачи обновлен'));
  }

  public removeTask(taskId: string) {
    this.taskService
      .removeTask(taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => console.log('Задача удалена'));
  }

  public updateTaskText(task: Task) {
    this.taskService
      .updateTaskText(task.id, task.text)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => console.log('Текст задачи обновлен'));
  }

  public toggleAllTasks() {
    this.taskService
      .toggleAllTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => console.log('Статус задач переключен'));
  }

  public removeCompletedTasks() {
    this.taskService
      .removeCompletedTasks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => console.log('Все завершенные задачи удалены'));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }
}
