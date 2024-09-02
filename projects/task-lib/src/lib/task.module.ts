import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task';
import { TasksColumnComponent } from './task-column';
import { TaskFormComponent } from './task-form';
import { TaskService } from './task.service';

@NgModule({
  declarations: [TaskComponent, TasksColumnComponent, TaskFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [TasksColumnComponent, TaskFormComponent],
  providers: [TaskService],
})
export class TaskModule {}
