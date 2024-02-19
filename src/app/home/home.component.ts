import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../shared/ui/modal/modal.component';
import { Checklist } from '../shared/interfaces/checklist';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header>
      <h1>Quicklist</h1>
      <button (click)="checklistBeingEdited.set({})">Add Quicklist</button>
    </header>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>Add new Quicklist</ng-template>
    </app-modal>
  `,
  styles: [],
  imports: [CommonModule, ModalComponent],
})
export default class HomeComponent {
  checklistBeingEdited = signal<Partial<Checklist | null>>(null);
}
