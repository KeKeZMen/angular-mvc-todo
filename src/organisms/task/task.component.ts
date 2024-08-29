import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnChanges {
  @Input({ required: true }) task?: Task;

  @Output() changeStatus = new EventEmitter<string>();
  public isTaskDone: boolean = false;
  onStatusChange() {
    if (this.task) {
      this.changeStatus.emit(this.task.id);
    }
  }

  @Output() delete = new EventEmitter<string>();
  onDelete() {
    if (this.task) {
      this.delete.emit(this.task.id);
    }
  }

  @Output() taskUpdated = new EventEmitter<Task>();
  isEditing: boolean = false;
  editedTaskText: string = '';
  edit() {
    if (this.task) {
      this.isEditing = true;
      this.editedTaskText = this.task.text;
    }
  }

  save() {
    if (!this.task) return;
    if (this.editedTaskText.trim()) {
      this.task.text = this.editedTaskText;
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
    if (this.task) {
      this.isTaskDone = this.task.status === TaskStatus.COMPLETED;
    }
  }
}
