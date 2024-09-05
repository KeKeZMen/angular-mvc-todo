import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task';
import { TasksColumnComponent } from './task-column';
import { TaskFormComponent } from './task-form';
import { TaskService } from './task.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TaskInterceptor } from './interceptors';

@NgModule({
  declarations: [TaskComponent, TasksColumnComponent, TaskFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [TasksColumnComponent, TaskFormComponent],
  providers: [
    TaskService,
    { provide: HTTP_INTERCEPTORS, useClass: TaskInterceptor, multi: true },
  ],
})
export class TaskModule {}
