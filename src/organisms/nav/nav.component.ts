import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskStatus } from '@models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  links: string[] = [
    'all',
    ...Object.values(TaskStatus)
      .filter((k) => typeof k === 'string')
      .map((status) => status.toLowerCase()),
  ];
}
