import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskStatus } from '@models';
import { TaskService } from '@services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPageComponent implements OnInit, OnDestroy {
  public incompletedTaskCount: number = 0;
  public tasksCount: number = 0;
  public _tasksSubscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this._tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.incompletedTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.ACTIVE
      ).length;

      this.tasksCount = tasks.length;
    });
  }

  removeCompleted() {
    this.taskService.removeCompletedTasks();
  }

  ngOnDestroy(): void {
    this._tasksSubscription.unsubscribe();
  }
}
