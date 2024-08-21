import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TaskFormComponent],
})
export class TaskFormModule {}
