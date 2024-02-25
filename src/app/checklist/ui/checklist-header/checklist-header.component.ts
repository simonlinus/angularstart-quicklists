import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from 'src/app/shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>{{ checklist.title }}</h1>
      <div><button (click)="resetChecklist.emit()">Reset all</button></div>
      <div><button (click)="addItem.emit()">Add item</button></div>
    </header>
  `,
  styles: ``,
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() resetChecklist = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<void>();
}
