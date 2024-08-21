import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITask, TaskStatus } from '@models';
import { TaskService } from '@services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-column',
  templateUrl: './tasks-column.component.html',
  styleUrl: './tasks-column.component.css',
})
export class TasksColumnComponent implements OnInit, OnDestroy {
  public filteredTasks$ = new Observable<ITask[]>();
  private _filteredTasksSubscription = new Subscription();
  private _isAllTasksCompletedSubscription = new Subscription();
  public toogledAllTask: boolean = false;
  public showAllTaskToogle: boolean = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const status: TaskStatus | 'ALL' =
        ((params['status'] as string).toUpperCase() as TaskStatus) || 'ALL';

      this.filteredTasks$ = this.taskService.getTasks(status);

      this._filteredTasksSubscription = this.filteredTasks$.subscribe(
        (tasks) => {
          this.showAllTaskToogle = tasks.length > 0;
        }
      );
    });

    this._isAllTasksCompletedSubscription =
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

  updateTask(task: ITask) {
    this.taskService.updateTaskText(task.id, task.text);
  }

  toggleAll() {
    this.taskService.toggleAllTasks();
  }

  ngOnDestroy(): void {
    this._filteredTasksSubscription.unsubscribe();
    this._isAllTasksCompletedSubscription.unsubscribe();
  }
}
