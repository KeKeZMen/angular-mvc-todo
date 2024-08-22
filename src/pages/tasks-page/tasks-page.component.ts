import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '@services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPageComponent implements OnInit, OnDestroy {
  private tasksSubscription = new Subscription();

  public tasksCount: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.tasks$.subscribe(
      (tasks) => (this.tasksCount = tasks.length)
    );
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }
}
