import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '@services';

export interface ICreateTaskForm {
  text: FormControl<string | null>;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  public createTaskForm: FormGroup = new FormGroup<ICreateTaskForm>({
    text: new FormControl(null, Validators.required),
  });

  constructor(private taskService: TaskService) {}

  onSubmit($event: KeyboardEvent) {
    if ($event.key == 'Enter')
      if (this.createTaskForm.valid) {
        this.taskService.createTask(this.createTaskForm.value?.text);
        this.createTaskForm.reset();
      }
  }
}
