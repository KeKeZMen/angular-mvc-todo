import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { Subject, takeUntil } from 'rxjs';

export interface ICreateTaskForm {
  text: FormControl<string | null>;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnDestroy {
  public createTaskForm: FormGroup = new FormGroup<ICreateTaskForm>({
    text: new FormControl(null, Validators.required),
  });

  private unsubscribe$ = new Subject<boolean>();

  constructor(private taskService: TaskService) {}

  public onSubmit($event: KeyboardEvent) {
    if ($event.key == 'Enter')
      if (this.createTaskForm.valid) {
        this.taskService
          .createTask(this.createTaskForm.value?.text)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => {
            this.createTaskForm.reset();
            console.log('Задача создана');
          });
      }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }
}
