import { NgModule } from '@angular/core';
import { TasksColumnModule, TaskFormModule, NavModule } from '@organisms';
import { TasksRoutingModule } from './tasks-page-routing.module';
import { TasksPageComponent } from './tasks-page.component';
import { CommonModule } from '@angular/common';
import { TaskService } from '@services';

@NgModule({
  declarations: [TasksPageComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    TaskFormModule,
    TasksColumnModule,
    NavModule,
  ],
  providers: [TaskService],
})
export class TasksPageModule {}
