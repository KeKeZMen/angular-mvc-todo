import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TasksColumnComponent } from './tasks-column.component';
import { TaskModule } from '@organisms/task/task.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TasksColumnComponent],
  imports: [CommonModule, TaskModule, FormsModule, AsyncPipe],
  exports: [TasksColumnComponent],
})
export class TasksColumnModule {}
