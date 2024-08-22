import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskStatus } from '@models';
import { TaskService } from '@services';
import { convertToStatus } from '@utils';
import { Observable, switchMap, tap, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-column',
  templateUrl: './tasks-column.component.html',
  styleUrl: './tasks-column.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksColumnComponent implements OnInit, OnDestroy {
  public filteredTasks$ = new Observable<Task[]>();
  private tasksSubscription = new Subscription();

  public hasTasks: boolean = false;

  public toggledAllTasks: boolean = false;

  public status: TaskStatus | 'ALL' = 'ALL';

  private isAllTasksCompletedSubscription = new Subscription();

  @Input({ required: true }) public tasksCount: number = 0;

  public incompletedTaskCount: number = 0;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const paramsStatus = paramMap.get('status');
      let status: TaskStatus | 'ALL' = 'ALL';

      if (paramsStatus) {
        status = convertToStatus(paramsStatus) ?? 'ALL';
      }

      this.filteredTasks$ = this.taskService.getTasks(status);

      this.filteredTasksSubscription = this.filteredTasks$.subscribe(
        (tasks) => {
          this.showAllTaskToogle = tasks.length > 0;
        }
      );
    });

    this.isAllTasksCompletedSubscription =
      this.taskService.isAllTasksCompleted$.subscribe(
        (isAllTasksCompleted) => (this.toogledAllTask = isAllTasksCompleted)
      );
  }

  onStatusChange(taskId: string) {
    this.taskService.changeTaskStatus(taskId);
  }

  onDelete(taskId: string) {
    this.taskService.removeTask(taskId);
  }

  clearCompleted() {
    this.taskService.removeCompletedTasks();
  }

  updateTask(task: Task) {
    this.taskService.updateTaskText(task.id, task.text);
  }

  toggleAll() {
    this.taskService.toggleAllTasks();
  }

  ngOnDestroy(): void {
    this.filteredTasksSubscription.unsubscribe();
    this.isAllTasksCompletedSubscription.unsubscribe();
  }
}
