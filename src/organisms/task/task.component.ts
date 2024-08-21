import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Task, TaskStatus } from '@models';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  outputs: ['changeStatus', 'delete', 'taskUpdated'],
})
export class TaskComponent implements OnChanges {
  @Input({ required: true }) task: Task | undefined;

  @Output() changeStatus = new EventEmitter<string>();
  public isTaskDone: boolean = false;
  onStatusChange() {
    this.changeStatus.emit(this.task?.id);
  }

  @Output() delete = new EventEmitter<string>();
  onDelete() {
    this.delete.emit(this.task?.id);
  }

  @Output() taskUpdated = new EventEmitter<Task>();
  isEditing: boolean = false;
  editedTaskText: string = '';
  edit() {
    this.isEditing = true;
    this.editedTaskText = this.task ? this.task.text : '';
  }

  save() {
    if (this.editedTaskText.trim()) {
      this.task ? (this.task.text = this.editedTaskText) : undefined;
      this.taskUpdated.emit(this.task);
    }
    this.isEditing = false;
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.save();
    }
  }

  ngOnChanges(): void {
    this.isTaskDone = this.task?.status === TaskStatus.COMPLETED;
  }
}
