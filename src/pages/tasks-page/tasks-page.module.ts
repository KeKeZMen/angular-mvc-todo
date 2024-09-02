import { NgModule } from '@angular/core';
import { NavModule } from '@organisms';
import { TasksRoutingModule } from './tasks-page-routing.module';
import { TasksPageComponent } from './tasks-page.component';
import { CommonModule } from '@angular/common';
import { TaskModule } from '@task-lib';

@NgModule({
  declarations: [TasksPageComponent],
  imports: [CommonModule, TasksRoutingModule, NavModule, TaskModule],
})
export class TasksPageModule {}
