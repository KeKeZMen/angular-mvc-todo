import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksPageComponent } from './tasks-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/all',
    pathMatch: 'full',
  },
  {
    path: ':status',
    component: TasksPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
