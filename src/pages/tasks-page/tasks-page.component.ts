import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from '@services';
import { map } from 'rxjs';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPageComponent {
  public tasksCount$ = inject(TaskService).tasks$.pipe(
    map((tasks) => tasks.length)
  );
}
