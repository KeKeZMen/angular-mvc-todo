import { Component } from '@angular/core';
import { TaskStatus } from '@models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  links: string[] = [
    'all',
    ...Object.values(TaskStatus)
      .filter((k) => typeof k === 'string')
      .map((status) => status.toLowerCase()),
  ];
}
