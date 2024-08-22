import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskComponent],
  imports: [CommonModule, FormsModule],
  exports: [TaskComponent],
})
export class TaskModule {}
