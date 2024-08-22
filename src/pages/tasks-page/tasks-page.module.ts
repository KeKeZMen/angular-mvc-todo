import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksColumnModule, TaskFormModule, NavModule } from '@organisms';
import { TasksRoutingModule } from './tasks-page-routing.module';
import { TasksPageComponent } from './tasks-page.component';

@NgModule({
  declarations: [TasksPageComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    TaskFormModule,
    TasksColumnModule,
    NavModule,
  ],
})
export class TasksPageModule {}
