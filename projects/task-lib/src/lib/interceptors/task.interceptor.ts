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

      switch (method) {
        case 'POST': {
          const newTask: Task = {
            id: Date.now().toString(),
            text: req.body.text,
            status: TaskStatus.ACTIVE,
          };
          tasks.push(newTask);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          return of(new HttpResponse({ status: 200 }));
        }

        case 'GET': {
          const requestedTasks = tasks.filter(
            (task) => task.status === req.params.get('status')
          );
          return of(new HttpResponse({ status: 200, body: requestedTasks }));
        }

        case 'PATCH': {
          const isCompleteAllTasks = req.params.has('all');

          const updatedTasks = isCompleteAllTasks
            ? tasks.map((task) => ({ ...task, status: TaskStatus.COMPLETED }))
            : tasks.map((task) => {
                if (task.id === req.params.get('id')) {
                  if (req.body.status) {
                    task.status === TaskStatus.ACTIVE
                      ? (task.status = TaskStatus.COMPLETED)
                      : (task.status = TaskStatus.ACTIVE);
                  }

                  if (req.body.text) {
                    task.text = req.body.text;
                  }
                }
              });

          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
          return of(new HttpResponse({ status: 200 }));
        }

        case 'DELETE': {
          const isDeleteAllCompletedTasks = req.params.has('all');

          const updatedTasks = isDeleteAllCompletedTasks
            ? tasks.filter((task) => task.status !== TaskStatus.COMPLETED)
            : tasks.filter((task) => task.id !== req.params.get('id'));

          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
          return of(new HttpResponse({ status: 200 }));
        }
      }
    }

    return next.handle(req);
  }
}
