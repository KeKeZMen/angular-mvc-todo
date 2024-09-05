import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPageComponent {}
