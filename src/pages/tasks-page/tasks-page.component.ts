import { Component, OnInit } from '@angular/core';
import { TaskService } from '@services';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPageComponent implements OnInit {
  public tasksCount$ = new Observable<number>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasksCount$ = this.taskService.tasks$.pipe(
      map((tasks) => tasks.length)
    );
  }
}
