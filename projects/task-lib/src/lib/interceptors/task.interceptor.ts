import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../models';

@Injectable()
export class TaskInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { method, url } = req;

    if (url.includes('/tasks')) {
      const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
      let isAllTasksCompleted = tasks.every(
        (task) => task.status === TaskStatus.COMPLETED
      );

      switch (method) {
        case 'POST': {
          const newTask: Task = {
            id: Date.now().toString(),
            text: req.body.text,
            status: TaskStatus.ACTIVE,
          };
          isAllTasksCompleted = false;
          localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
          return of(new HttpResponse({ status: 200, body: newTask }));
        }

        case 'GET': {
          return of(new HttpResponse({ status: 200, body: tasks }));
        }

        case 'PATCH': {
          const isCompleteAllTasks = req.params.has('all');
          isAllTasksCompleted = !isAllTasksCompleted;

          const updatedTasks = isCompleteAllTasks
            ? tasks.map((task) => ({
                ...task,
                status: isAllTasksCompleted
                  ? TaskStatus.COMPLETED
                  : TaskStatus.ACTIVE,
              }))
            : tasks.map((task) => {
                if (task.id === req.params.get('id')) {
                  if (req.body.text) {
                    task.text = req.body.text;
                  } else {
                    task.status === TaskStatus.ACTIVE
                      ? (task.status = TaskStatus.COMPLETED)
                      : (task.status = TaskStatus.ACTIVE);
                  }
                }
                return task;
              });

          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
          return of(new HttpResponse({ status: 200, body: updatedTasks }));
        }

        case 'DELETE': {
          const isDeleteAllCompletedTasks = req.params.has('all');

          const updatedTasks = isDeleteAllCompletedTasks
            ? tasks.filter((task) => task.status !== TaskStatus.COMPLETED)
            : tasks.filter((task) => task.id !== req.params.get('id'));

          isAllTasksCompleted = updatedTasks.every(
            (task) => task.status === TaskStatus.COMPLETED
          );

          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
          return of(new HttpResponse({ status: 200, body: updatedTasks }));
        }
      }
    }

    return next.handle(req);
  }
}
