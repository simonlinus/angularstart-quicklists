import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../shared/ui/modal/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal/form-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header>
      <h1>Quicklist</h1>
      <button (click)="checklistBeingEdited.set({})">Add Quicklist</button>
    </header>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <app-form-modal
        [title]="
          checklistBeingEdited()?.title
            ? checklistBeingEdited()!.title!
            : 'Add checklist'
        "
        [formGroup]="checklistForm"
        ]
      />
    </app-modal>
  `,
  styles: [],
  imports: [CommonModule, ModalComponent, FormModalComponent],
})
export default class HomeComponent {
  formBuilder = inject(FormBuilder);
  checklistBeingEdited = signal<Partial<Checklist | null>>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: '',
  });
}
